"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = exports.Query = void 0;
const user_1 = __importDefault(require("./user"));
exports.Query = Object.assign({}, user_1.default.Queries);
exports.Mutation = Object.assign({}, user_1.default.Mutations);
