import express from 'express'
import { HOSTNAME, PORT } from './config/env.js'
import { routes } from './routes/index.route.js'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler.middlewares.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded( { extended: true}))

// route
app.use('/api/v1', routes)
app.use(errorHandler)

app.listen(PORT ,() => {
    console.log(`Server running on http://${HOSTNAME}:${PORT}`)
})

export default app