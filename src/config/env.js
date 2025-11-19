import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export const {
    PORT, 
    HOSTNAME,
    DATABASE_URL,
    JWT_SECRET,
    NODE_ENV
} = process.env