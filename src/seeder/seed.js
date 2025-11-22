import bcrypt from 'bcrypt'

// Import the generated Prisma client
import prismaPkg from '../../generated/prisma/index.js'
import { createNewSession } from '../utils/sessionManagement.js'
const { PrismaClient } = prismaPkg
const prisma = new PrismaClient()

const SALT_ROUNDS = 10

async function getPasswordColumnMax() {
  try {
    const res = await prisma.$queryRaw`SELECT character_maximum_length FROM information_schema.columns WHERE table_name='users' AND column_name='password'`
    const max = Array.isArray(res) ? (res[0] && (res[0].character_maximum_length ?? res[0].character_maximum_length)) : (res && res.character_maximum_length)
    return max ? Number(max) : null
  } catch (e) {
    return null
  }
}

async function main() {
  console.log('Seeding database (bcrypt passwords, salt=10)...')

  // Check password column size to ensure bcrypt fits (~60 chars)
  const max = await getPasswordColumnMax()
  if (max && max < 60) {
    console.error(`ERROR: users.password column max length is ${max}. Bcrypt hashes require ~60 chars.`)
    console.error('Please increase the column length in `src/models/schema.prisma` (e.g. `String @db.VarChar(200)`) and run `npx prisma db push` before running the seeder.')
    process.exit(1)
  }

  // --- CATEGORIES (5)
  const categoriesData = [
    { id_category: 'cat-1', name: 'Elektronik', description: 'Perangkat elektronik' },
    { id_category: 'cat-2', name: 'Makanan', description: 'Produk makanan' },
    { id_category: 'cat-3', name: 'Pakaian', description: 'Busana dan aksesori' },
    { id_category: 'cat-4', name: 'Kecantikan', description: 'Produk kecantikan' },
    { id_category: 'cat-5', name: 'Alat Tulis', description: 'Perlengkapan kantor' }
  ]

  // helper to pick defaults based on column type (must be defined before any getRequiredCols calls)
  function defaultForType(data_type) {
    if (!data_type) return ''
    const t = String(data_type).toLowerCase()
    if (t.includes('char') || t.includes('text')) return ''
    if (t.includes('int') || t.includes('numeric') || t.includes('decimal')) return 0
    if (t.includes('date') || t.includes('time')) return new Date()
    if (t.includes('bool')) return false
    return ''
  }

  // Cache required columns per table to avoid repeated queries
  const requiredColsCache = {}
  async function getRequiredCols(table) {
    if (requiredColsCache[table]) return requiredColsCache[table]
    const cols = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name=${table} AND is_nullable='NO' AND column_default IS NULL
    `
    requiredColsCache[table] = cols
    return cols
  }

  // Helpers to map snake_case DB column names to Prisma client keys (camelCase)
  function toCamel(s) {
    return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
  }

  function mapKeysToPrisma(modelName, obj) {
    const out = {}
    const tryCamel = (k) => toCamel(k)
    const modelFields = (prisma && prisma._dmmf && prisma._dmmf.modelMap && prisma._dmmf.modelMap[modelName])
      ? prisma._dmmf.modelMap[modelName].fields.map(f => f.name)
      : null

    for (const k of Object.keys(obj || {})) {
      if (modelFields) {
        if (modelFields.includes(k)) {
          out[k] = obj[k]
          continue
        }
        const ck = tryCamel(k)
        if (modelFields.includes(ck)) {
          out[ck] = obj[k]
          continue
        }
      }
      // fallback: use original key
      out[k] = obj[k]
    }
    return out
  }

  async function upsertModel(modelName, whereObj, updateObj, createObj) {
    const model = prisma[modelName]
    if (!model) throw new Error(`Prisma model ${modelName} not found`)
    const whereMapped = mapKeysToPrisma(modelName, whereObj)
    const updateMapped = mapKeysToPrisma(modelName, updateObj)
    const createMapped = mapKeysToPrisma(modelName, createObj)
    return model.upsert({ where: whereMapped, update: updateMapped, create: createMapped })
  }

  // DEBUG: print DMMF model keys and a couple of model fields (will remove later)
  try {
    if (prisma && prisma._dmmf && prisma._dmmf.modelMap) {
      console.log('DMMF models:', Object.keys(prisma._dmmf.modelMap))
      if (prisma._dmmf.modelMap.session) {
        console.log('session fields:', prisma._dmmf.modelMap.session.fields.map(f => f.name))
      }
    }
  } catch (e) {
    console.warn('Could not read prisma DMMF:', e.message || e)
  }

  for (const c of categoriesData) {
    const createObj = { ...c }
    const req = await getRequiredCols('categories')
    for (const rc of req) {
      const col = rc.column_name
      if (createObj[col] === undefined) createObj[col] = defaultForType(rc.data_type)
    }
    await upsertModel('categories', { name: c.name }, { description: c.description }, createObj)
  }

  // Build a map of category name -> id_category (handles existing rows with different ids)
  const categoriesMap = {}
  for (const c of categoriesData) {
    const dbC = await prisma.categories.findUnique({ where: { name: c.name } })
    if (dbC) categoriesMap[c.name] = dbC.id_category
  }

  // --- USERS (5) - create bcrypt hashes
  const usersData = [
    { id_user: 'user-1', name: 'Admin Satu', email: 'admin1@example.com', plain: 'pass1', role: 'admin', contact: '081100000001' },
    { id_user: 'user-2', name: 'User Dua', email: 'user2@example.com', plain: 'pass2', role: 'user', contact: '081100000002' },
    { id_user: 'user-3', name: 'User Tiga', email: 'user3@example.com', plain: 'pass3', role: 'user', contact: '081100000003' },
    { id_user: 'user-4', name: 'User Empat', email: 'user4@example.com', plain: 'pass4', role: 'user', contact: '081100000004' },
    { id_user: 'user-5', name: 'User Lima', email: 'user5@example.com', plain: 'pass5', role: 'user', contact: '081100000005' }
  ]

  const requiredCols = await getRequiredCols('users')

  for (const u of usersData) {
    const hash = await bcrypt.hash(u.plain, SALT_ROUNDS)
    // base create object with known fields
    const createObj = { id_user: u.id_user, name: u.name, email: u.email, password: hash, role: u.role, contact: u.contact }

    // Supply defaults for any required columns not present in createObj
    for (const rc of requiredCols) {
      const col = rc.column_name
      if (createObj[col] === undefined) {
        createObj[col] = defaultForType(rc.data_type)
      }
    }

    await upsertModel('users', { email: u.email }, { name: u.name, password: hash, role: u.role, contact: u.contact }, createObj)
  }

  // --- PRODUCTS (5) - associate with categories
  // Products: reference categories by name to ensure correct FK mapping
  const productsData = [
    { id_product: 'prod-1', categoryName: 'Elektronik', name: 'Handphone', description: 'Smartphone' },
    { id_product: 'prod-2', categoryName: 'Elektronik', name: 'Laptop', description: 'Laptop gaming' },
    { id_product: 'prod-3', categoryName: 'Makanan', name: 'Roti Tawar', description: 'Roti segar' },
    { id_product: 'prod-4', categoryName: 'Pakaian', name: 'Kaos Polos', description: 'Kaos katun' },
    { id_product: 'prod-5', categoryName: 'Alat Tulis', name: 'Pulpen', description: 'Pulpen tinta hitam' }
  ]

  // Determine required product columns so we can provide defaults if schema differs
  const requiredProductCols = await prisma.$queryRaw`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name='products' AND is_nullable='NO' AND column_default IS NULL
  `

  for (const p of productsData) {
    const categoryId = categoriesMap[p.categoryName]
    if (!categoryId) {
      throw new Error(`Missing category id for ${p.categoryName}`)
    }

    const createObj = { id_product: p.id_product, id_category: categoryId, name: p.name, description: p.description }
    for (const rc of requiredProductCols) {
      const col = rc.column_name
      if (createObj[col] === undefined) {
        createObj[col] = defaultForType(rc.data_type)
      }
    }

    await upsertModel('products', { id_product: p.id_product }, { name: p.name, description: p.description, id_category: categoryId }, createObj)
  }

  // Build product map id_product -> id_product (ensure existence)
  const productMap = {}
  for (const p of productsData) {
    const dbP = await prisma.products.findUnique({ where: { id_product: p.id_product } })
    if (dbP) productMap[p.id_product] = dbP.id_product
  }

  // --- STOCKS (5) - link to products
  const stocksData = [
    { id_stock: 'stock-1', id_product: 'prod-1', amount: 20, price: 2500000 },
    { id_stock: 'stock-2', id_product: 'prod-2', amount: 8, price: 7500000 },
    { id_stock: 'stock-3', id_product: 'prod-3', amount: 100, price: 7000 },
    { id_stock: 'stock-4', id_product: 'prod-4', amount: 40, price: 50000 },
    { id_stock: 'stock-5', id_product: 'prod-5', amount: 200, price: 3000 }
  ]

  for (const s of stocksData) {
    const prodId = productMap[s.id_product]
    if (!prodId) throw new Error(`Missing product for stock ${s.id_stock}`)
    const createObj = { id_stock: s.id_stock, id_product: prodId, amount: s.amount, price: s.price }
    const reqStocks = await getRequiredCols('stocks')
    for (const rc of reqStocks) {
      const col = rc.column_name
      if (createObj[col] === undefined) createObj[col] = defaultForType(rc.data_type)
    }
    await upsertModel('stocks', { id_stock: s.id_stock }, { amount: s.amount, price: s.price }, createObj)
  }

  // --- SESSIONS (5) - one per user
  // Build user map (email -> id_user) to handle existing users created earlier with different id_user
  const userMap = {}
  for (const u of usersData) {
    const dbU = await prisma.users.findUnique({ where: { email: u.email } })
    if (dbU) userMap[u.email] = dbU.id_user
  }

  const sessionsData = usersData.map((u, i) => ({
    id_session: `sess-${i+1}`,
    id_user: userMap[u.email] || u.id_user,
    token: `token-${i+1}`,
    role: u.role,
    isActive: true
  }))

  const reqSession = await getRequiredCols('session')
  for (const se of sessionsData) {
    const createObj = { ...se }
    for (const rc of reqSession) {
      const col = rc.column_name
      if (createObj[col] === undefined) createObj[col] = defaultForType(rc.data_type)
    }
    await upsertModel('session', { id_session: se.id_session }, { token: se.token, role: se.role, isActive: se.isActive }, createObj)
  }

  // --- TRANSACTION_LOGS (5) - link users & products
  const txData = [
    { id_transaction: 'tx-1', userEmail: 'user2@example.com', productId: 'prod-1', amount: 1, date: new Date(), price: 2500000, type: 'sell' },
    { id_transaction: 'tx-2', userEmail: 'user3@example.com', productId: 'prod-3', amount: 2, date: new Date(), price: 7000, type: 'buy' },
    { id_transaction: 'tx-3', userEmail: 'user4@example.com', productId: 'prod-4', amount: 3, date: new Date(), price: 50000, type: 'sell' },
    { id_transaction: 'tx-4', userEmail: 'user5@example.com', productId: 'prod-5', amount: 10, date: new Date(), price: 3000, type: 'buy' },
    { id_transaction: 'tx-5', userEmail: 'user2@example.com', productId: 'prod-2', amount: 1, date: new Date(), price: 7500000, type: 'sell' }
  ]

  // Note: txData references users by email to find current id_user
  const reqTx = await getRequiredCols('transaction_logs')
  for (const t of txData) {
    const userId = userMap[t.userEmail]
    const prodId = productMap[t.productId]
    if (!userId) throw new Error(`Missing user for transaction ${t.id_transaction}`)
    if (!prodId) throw new Error(`Missing product for transaction ${t.id_transaction}`)
    const createObj = { id_transaction: t.id_transaction, id_user: userId, id_product: prodId, amount: t.amount, date: t.date, price: t.price, type: t.type }
    for (const rc of reqTx) {
      const col = rc.column_name
      if (createObj[col] === undefined) createObj[col] = defaultForType(rc.data_type)
    }
    await upsertModel('transaction_logs', { id_transaction: t.id_transaction }, { amount: t.amount, price: t.price, date: t.date, type: t.type }, createObj)
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error('Seeder error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })