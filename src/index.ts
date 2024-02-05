import express from 'express'
import { createServer } from 'http'
import { connect } from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled
} from 'apollo-server-core'
import { GraphQLScalarType, Kind } from 'graphql'

import typeDefs from './gql/typeDefs'
import { Query, Mutation } from './gql/resolvers'
import 'dotenv/config'

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: any): Date {
    return value.getTime()
  },
  parseValue(value: any): Date {
    return new Date(value)
  },
  parseLiteral(ast): any {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    return null
  }
})

const port = process.env.PORT ?? 5050
const DB_URL =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.xeutukt.mongodb.net/` ??
  ''

async function startDB() {
  await connect(DB_URL)
    .then(() => console.log('DB connected'))
    .catch(err => {
      console.log(err)
      console.log('Error connecting to DB.')
    })
}
const isProduction = process.env.ENVIRONMENT === 'PRODUCTION'
async function startApolloServer() {
  const app = express()
  const httpServer = createServer(app)
  const apollogPlugins = [ApolloServerPluginDrainHttpServer({ httpServer })]
  if (!isProduction) {
    apollogPlugins.push(ApolloServerPluginLandingPageDisabled())
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation, Date: dateScalar },
    context: async ({ req }) => {
      // TODO: build out token deciphering here
      const encodedToken = ''
      // if (encodedToken) {
      //     const tokenString = encodedToken
      //         ? encodedToken.split('Bearer')[1]
      //         : ''

      //     console.log(tokenString)
      //     // const user = jwt_decode(tokenString)

      //     return { req }
      //     // return { req, user }
      // }
    },
    plugins: [...apollogPlugins],
    introspection: !isProduction
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise(resolve => httpServer.listen({ port }, resolve as any))
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
}

startApolloServer()
