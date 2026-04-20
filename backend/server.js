import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './src/routes/index.js'
import errorHandler from './src/middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use(routes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})