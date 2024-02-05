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
Object.defineProperty(exports, "__esModule", { value: true });
const userResolver_js_1 = __importDefault(require("./userResolver.js"));
const resolver = new userResolver_js_1.default();
const Queries = {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield resolver.getAllUsers();
            }
            catch (error) {
                return resolver.catchError('fetching all users');
            }
        });
    }
};
const Mutations = {
    signIn(_, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(payload);
            try {
                const res = yield resolver.signIn(payload);
                return res;
            }
            catch (error) {
                return resolver.catchError('signing in the user');
            }
        });
    },
    deleteProfile(_, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(payload);
            // TODO: Check token before executing request. Build in a development backdoor
            try {
                const res = yield resolver.deleteProfile(payload.email);
                return res;
            }
            catch (error) {
                return resolver.catchError('deleting that profile');
            }
        });
    }
};
exports.default = { Queries, Mutations };
