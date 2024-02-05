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
const baseResolver_1 = __importDefault(require("../../baseResolver"));
const User_1 = __importDefault(require("../../../models/User"));
class UserResolver extends baseResolver_1.default {
    constructor() {
        super();
        this.addedErrors = {
            noUsersFound: {
                type: 'noUsersFound',
                message: () => 'No users found'
            },
            userNotFound: {
                type: 'userNotFound',
                message: () => 'User not found'
            }
        };
        this.errors = Object.assign(Object.assign({}, this.errors), this.addedErrors);
        this.typenames = {
            single: 'User',
            multi: 'MultiUsersSuccess'
        };
    }
    catchError(action) {
        return this.catchError(action);
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield User_1.default.find();
            if ((allUsers === null || allUsers === void 0 ? void 0 : allUsers.length) == 0) {
                this.error = this.errors.noUsersFound();
                return this.handleError();
            }
            return this.handleMultiItemSuccess('users', allUsers);
        });
    }
    signIn({ email, fullName, avatar, providerId }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                this.error = this.errors.userNotFound;
                return this.handleError();
            }
            const user = yield User_1.default.findOne({ email });
            if (user !== null) {
                user.lastLogin = new Date();
                const saved = yield user.save();
                this.typename = this.typenames.single;
                return this.handleSingleItemSuccess(saved);
            }
            else {
                const [firstName, lastName] = (_a = fullName === null || fullName === void 0 ? void 0 : fullName.split(' ')) !== null && _a !== void 0 ? _a : ['', ''];
                const newUser = new User_1.default({
                    email,
                    firstName,
                    lastName,
                    avatar,
                    providerId,
                    lastLogin: new Date()
                });
                const saved = yield newUser.save();
                this.typename = this.typenames.single;
                return this.handleSingleItemSuccess(saved);
            }
        });
    }
    deleteProfile(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.find({ email });
            if (!user) {
                this.error = this.errors.userNotFound;
                return this.handleError();
            }
            const res = yield User_1.default.findOneAndDelete({ email });
            this.typename = this.typenames.single;
            return this.handleSingleItemSuccess(res);
        });
    }
}
exports.default = UserResolver;
