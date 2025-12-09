import bcrypt from "bcrypt";

// Import the generated Prisma client
import prismaPkg from "../../generated/prisma/index.js";
import { createNewSession } from "../utils/sessionManagement.js";
import { createTransactionService } from "../services/transactions/createTransaction.service.js";
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

let saltRounds = 10;

async function createAdminAccount() {
    if (!(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD))
        throw new Error(
            "Missing admin credential in enviroment: ADMIN_USERNAME, ADMIN_PASSWORD",
        );

    const user = await prisma.users.upsert({
        where: {
            username: process.env.ADMIN_USERNAME,
        },
        update: {},
        create: {
            name: "Admin",
            username: process.env.ADMIN_USERNAME,
            password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, saltRounds),
            role: "admin",
            isActive: true,
        },
    });

    await createNewSession(user.id_user, "-", true);

    console.log(`Created admin account: ${user.username} (${user.id_user})`);
}

function pickRandom(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function randomDate(start, end) {
    const startTime = start.getTime();
    const endTime = end.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
}

async function main() {
    console.log("Seeding database...");

    await createAdminAccount();

    if (process.env.NODE_ENV !== "development")
        return console.log("Seeding finished for production environment");

    // Seed users
    if (!process.env.USER_PW_PREFIX)
        throw new Error("Missing USER_PW_PREFIX on environment");

    const users = [];
    for (let i = 1; i <= 10; i++) {
        const user = await prisma.users.upsert({
            where: { username: `user-${i}` },
            update: {},
            create: {
                username: `user-${i}`,
                name: `User ${i}`,
                password: bcrypt.hashSync(
                    process.env.USER_PW_PREFIX + i,
                    saltRounds,
                ),
                role: "user",
                isActive: true,
            },
        });

        await createNewSession(user.id_user, "-", true);
        users.push(user);

        console.log(`User created: ${user.username} (${user.id_user})`);
    }

    // Seed categories
    const categoriesData = [
        { name: "Elektronik", description: "Perangkat elektronik" },
        { name: "Makanan", description: "Produk makanan" },
        { name: "Pakaian", description: "Busana dan aksesori" },
        { name: "Kecantikan", description: "Produk kecantikan" },
        { name: "Alat Tulis", description: "Perlengkapan kantor" },
    ];

    const categories = {};

    for (let category of categoriesData) {
        const result = await prisma.categories.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });

        categories[result.name] = result;
    }

    // Seed products
    const productsData = [
        {
            id_category: categories["Elektronik"].id_category,
            SKU: "ELE-SMARTP-001",
            name: "Smartphone Canggih X1",
            description:
                "Smartphone terbaru dengan kamera 108MP dan baterai tahan lama.",
            unit: "pcs",
        },
        {
            id_category: categories["Elektronik"].id_category,
            SKU: "ELE-LAPTOP-002",
            name: "Laptop UltraTipis Pro",
            description:
                "Laptop ringan dan bertenaga, ideal untuk produktivitas dan hiburan.",
            unit: "pcs",
        },
        {
            id_category: categories["Elektronik"].id_category,
            SKU: "ELE-HEADSET-003",
            name: "Headset Nirkabel Premium",
            description:
                "Headset dengan kualitas suara jernih dan fitur noise cancelling.",
            unit: "pcs",
        },
        {
            id_category: categories["Makanan"].id_category,
            SKU: "FOD-KERIPK-001",
            name: "Keripik Kentang Original",
            description:
                "Keripik kentang renyah dengan rasa original yang gurih.",
            unit: "pack",
        },
        {
            id_category: categories["Pakaian"].id_category,
            SKU: "CLO-KAOS-001",
            name: "Kaos Katun Basic",
            description:
                "Kaos katun lembut dan nyaman untuk aktivitas sehari-hari.",
            unit: "pcs",
        },
        {
            id_category: categories["Pakaian"].id_category,
            SKU: "CLO-JEANS-002",
            name: "Celana Jeans Slim Fit",
            description:
                "Celana jeans model slim fit dengan bahan denim berkualitas.",
            unit: "pcs",
        },
        {
            id_category: categories["Kecantikan"].id_category,
            SKU: "BEA-SERUM-001",
            name: "Serum Wajah Anti-Aging",
            description:
                "Serum dengan formula khusus untuk mengurangi tanda penuaan dini.",
            unit: "pcs",
        },
        {
            id_category: categories["Kecantikan"].id_category,
            SKU: "BEA-LIPSTK-002",
            name: "Lipstik Matte Merah",
            description:
                "Lipstik dengan hasil akhir matte dan warna merah menyala.",
            unit: "pcs",
        },
        {
            id_category: categories["Alat Tulis"].id_category,
            SKU: "STA-PULPEN-001",
            name: "Pulpen Gel Warna Hitam",
            description: "Pulpen gel dengan tinta halus dan cepat kering.",
            unit: "pcs",
        },
        {
            id_category: categories["Alat Tulis"].id_category,
            SKU: "STA-BUKUC-002",
            name: "Buku Catatan A5 Spiral",
            description:
                "Buku catatan ukuran A5 dengan jilid spiral dan 100 lembar.",
            unit: "pcs",
        },
    ];

    const products = [];
    for (let product of productsData) {
        const productResult = await prisma.products.upsert({
            where: { SKU: product.SKU },
            update: {},
            create: {
                ...product,
                isActive: true,
            },
        });

        products.push(productResult);
    }

    // Seed transaksi
    const trxCount = parseInt(process.env.TRX_COUNT) || 10;
    const startTime = new Date(`${new Date().getFullYear()}-01-01`).getTime();
    const endTime = new Date().getTime();
    const totalDuration = endTime - startTime;
    const interval = totalDuration / (trxCount * 2 - 1);

    const buyTransactions = [];
    const sellTransactions = [];
    for (let i = 1; i <= trxCount; i++) {
        // Satu transaction bisa memiliki 1 sampe 3 item
        const randomItems = [];
        for (let i = 1; i <= parseInt(Math.random() * 3); i++) {
            const randomProduct = pickRandom(products);
            randomItems.push({
                amount: Math.ceil(Math.random() * Math.abs(randomProduct.minimum || 10) * 5),
                id_product: randomProduct.id_product,
                price: Math.ceil(Math.random() * 10) * 1e5,
            });
        }

        const buyTransactionResult = await createTransactionService({
            type: "buy",
            items: randomItems,
            id_user: pickRandom(users).id_user,
            date: new Date(startTime + interval * (i - 1) * 2),
        }, true);

        buyTransactions.push(buyTransactionResult);

        const sellTransactionResult = await createTransactionService({
            type: "sell",
            items: randomItems.map((item) => {
                return {
                    ...item,
                    amount: Math.ceil(Math.random() * item.amount),
                };
            }),
            id_user: pickRandom(users).id_user,
            date: new Date(startTime + interval * (i * 2) - 1),
        }, true);

        sellTransactions.push(sellTransactionResult);
    }

    console.log(`Created ${parseInt(process.env.TRX_COUNT) * 2} transactions`);

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error("Seeder error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
