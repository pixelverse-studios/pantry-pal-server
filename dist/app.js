"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const mongoose_1 = require("mongoose");
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const graphql_1 = require("graphql");
const typeDefs_1 = __importDefault(require("./gql/typeDefs"));
const resolvers_1 = require("./gql/resolvers");
require("dotenv/config");
const dateScalar = new graphql_1.GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value.getTime();
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    }
});
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5050;
const DB_URL = (_b = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.xeutukt.mongodb.net/`) !== null && _b !== void 0 ? _b : '';
function startDB() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongoose_1.connect)(DB_URL)
            .then(() => console.log('DB connected'))
            .catch(err => {
            console.log(err);
            console.log('Error connecting to DB.');
        });
    });
}
const isProduction = process.env.ENVIRONMENT === 'PRODUCTION';
console.log('isProduction: ', isProduction);
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const httpServer = (0, http_1.createServer)(app);
        const apollogPlugins = [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })];
        if (!isProduction) {
            apollogPlugins.push((0, apollo_server_core_1.ApolloServerPluginLandingPageDisabled)());
        }
        console.log('START APOLLO SERVER');
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: typeDefs_1.default,
            resolvers: { Query: resolvers_1.Query, Mutation: resolvers_1.Mutation, Date: dateScalar },
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                // TODO: build out token deciphering here
                const encodedToken = '';
                // if (encodedToken) {
                //     const tokenString = encodedToken
                //         ? encodedToken.split('Bearer')[1]
                //         : ''
                //     console.log(tokenString)
                //     // const user = jwt_decode(tokenString)
                //     return { req }
                //     // return { req, user }
                // }
            }),
            plugins: [...apollogPlugins],
            introspection: !isProduction
        });
        yield server.start();
        server.applyMiddleware({ app });
        yield new Promise(resolve => httpServer.listen({ port }, resolve));
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
}
startApolloServer();
