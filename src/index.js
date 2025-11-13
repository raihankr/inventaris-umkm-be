import express from 'express'
import { HOSTNAME, PORT } from './config/env.js'
import { routes } from './routes/index.route.js'
import morgan from 'morgan'
import errorHandler from './middlewares/errorHandler.middlewares.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded( { extended: true}))

// route
app.use('/api/v1', routes)
app.use('/', (req, res) => {
    res.json({
        "success" : true,
        "port" : PORT,
        "hostname" : HOSTNAME,
    })
})
app.use(errorHandler)

app.listen(PORT ,() => {
    console.log(`Server running on http://${HOSTNAME}:${PORT}`)
})