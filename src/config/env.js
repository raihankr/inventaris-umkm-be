import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// konfigurasi variable env agar mudah untuk digunakan.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === '""' || process.env.JWT_SECRET === '"') {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is not set in environment variables')
    }
    console.warn('Warning: JWT_SECRET not set — using fallback development secret')
    process.env.JWT_SECRET = 'dev-secret-change-me'
}

export const {
    PORT,
    HOSTNAME,
    DATABASE_URL,
    JWT_SECRET,
    NODE_ENV,
    FRONTEND_URL,
    FRONTEND_DOMAIN
} = process.env