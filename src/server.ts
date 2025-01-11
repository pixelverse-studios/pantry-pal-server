import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import categoriesRouter from './routes/categories'
import foodRouter from './routes/food'
import recipesRouter from './routes/recipes'
import usersRouter from './routes/users'

import 'dotenv/config'

const app: Application = express()
const PORT = process.env.PORT || 5002

process.title = 'MealThyme-Server'

app.use(bodyParser.json())
app.use(cors())

app.use(usersRouter)
app.use(foodRouter)
app.use(categoriesRouter)
app.use(recipesRouter)

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message })
  }
)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
