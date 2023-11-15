import express from 'express'
import codingRouter from './router/coding.js'

const app = express()
const port = 9003

app.use(express.json())

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', '*')
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  next()
})

app.use('/coding', codingRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})