import express from 'express'
import { createServer } from 'http'
import { connect } from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled
} from 'apollo-server-core'
import { GraphQLScalarType, Kind } from 'graphql'

import typeDefs from './gql/types/index.js'
import { Query, Mutation } from './gql/resolvers/index.js'
import config, { PRODUCTION } from './config.js'

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

const port = config.port
const DB_URL = config.db

async function startDB() {
  await connect(DB_URL)
    .then(() => console.log('DB connected'))
    .catch(err => {
      console.log(err)
      console.log('Error connecting to DB.')
    })
}
startDB()
const isProduction = config.environment === PRODUCTION
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
      // if (token) {
      //   // return { req, user }
      //   return { req }
      // }
      // TODO: add user in place of true
      return {
        req,
        user: token != null ? true : null,
        operation: req.body.operationName
      }
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
