"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    id: { type: 'UUID', unique: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    avatar: String,
    providerId: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
});
exports.default = (0, mongoose_1.model)('User', userSchema);
