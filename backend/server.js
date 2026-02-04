require('dotenv').config()
const port = process.env.PORT || 3000;
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const usersRouter = require('./routes/users')
const productsRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')
const consentsRouter = require('./routes/consents')
const logsRouter = require('./routes/logs')

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/consents', consentsRouter)
app.use('/logs', logsRouter)

app.listen(port, () => console.log('Server Started'))
