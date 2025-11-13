
# Setup & Installation

1. Cloning Repository
Langkah pertama, clone repository ini menggunakan command dibawah
```bash
git clone https://github.com/raihankr/inventaris-umkm-be.git
```

setelah clone berhasil, install seluruh package didalam project menggunakan command:
```bash
npm i
```

2. Environment Setup
Agar program dapat berjalan sepenuhnya, isi semua variable yang ada di dalam file **.env.example**. kemudian duplikat dan ubah nama file tersebut menjadi **.env**. pastikan file original **.env.example** tidak termodifikasi.

3. Database Migration
untuk mensetup ORM agar dapat digunakan, jalankan
```bash
npx prisma generate
```

selanjutnya untuk melakukan migrasi database, gunakan command dibawah ini
```bash
npx prisma migrate dev
```

atau jika tidak ingin data yang sudah ada sebelumnya terhapus, gunakan command
```bash
npx prisma db push
```
