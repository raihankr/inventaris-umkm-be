import dotenv from 'dotenv'

dotenv.config({ path: '.env' })
// Ensure JWT_SECRET exists in non-production environments to avoid runtime errors
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === '""' || process.env.JWT_SECRET === '"') {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is not set in environment variables')
    }
    // Development fallback (insecure) with a visible warning
    // DO NOT use this value in production
    // eslint-disable-next-line no-console
    console.warn('Warning: JWT_SECRET not set — using fallback development secret')
    process.env.JWT_SECRET = 'dev-secret-change-me'
}

export const {
    PORT,
    HOSTNAME,
    DATABASE_URL,
    JWT_SECRET,
    NODE_ENV,
    FRONTEND_URL
} = process.env