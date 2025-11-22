import express from 'express'
import { FRONTEND_URL, HOSTNAME, PORT } from './config/env.js'
import { routes } from './routes/index.route.js'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler.middlewares.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded( { extended: true}))
app.use(cors({ origin: FRONTEND_URL?.split(",") }))

// route
app.use('/api/v1', routes)
app.use(errorHandler)

app.listen(PORT ,() => {
    console.log(`Server running on http://${HOSTNAME}:${PORT}`)
})

export default app
