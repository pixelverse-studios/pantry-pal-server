import express from 'express'
import { createServer } from 'http'
import { connect } from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled
} from 'apollo-server-core'
import { GraphQLScalarType, Kind } from 'graphql'
import jwtDecode from 'jwt-decode'

import typeDefs from './gql/typeDefs.js'
import { Query, Mutation } from './gql/resolvers/index.js'
import 'dotenv/config'

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime()
  },
  parseValue(value) {
    return new Date(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    return null
  }
})

const port = process.env.PORT ?? 5050
const DB_URL =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.xeutukt.mongodb.net/?retryWrites=true&w=majority` ??
  ''

async function startDB() {
  await connect(DB_URL)
    .then(() => console.log('DB connected'))
    .catch(err => {
      console.log(err)
      console.log('Error connecting to DB.')
    })
}
startDB()
const isProduction = process.env.ENVIRONMENT === 'PRODUCTION'
async function startApolloServer() {
  const app = express()
  const httpServer = createServer(app)
  const apollogPlugins = [ApolloServerPluginDrainHttpServer({ httpServer })]
  if (isProduction) {
    apollogPlugins.push(ApolloServerPluginLandingPageDisabled())
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation, Date: dateScalar },
    context: async ({ req }) => {
      const token = req.headers?.authorization
      if (token) {
        const encodedString = token.split('Bearer')[1]
        const user = jwtDecode(encodedString)

        return { req, user }
      }
      return { req, user: null }
    },
    plugins: [...apollogPlugins],
    introspection: !isProduction
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise(resolve => httpServer.listen({ port }, resolve))
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
}

startApolloServer()
