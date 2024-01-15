import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import indexRoutes from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 3000

const __dirname = dirname(fileURLToPath(import.meta.url))

// configuration for send email
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(indexRoutes)

app.use(express.static(join(__dirname, 'public')))

app.listen(PORT, () => {
  console.log('Server is listening on port', PORT)    
})