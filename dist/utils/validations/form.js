"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormValidations = void 0;
const isValidString = (value) => typeof value === 'string' && value != '';
const isValidPositiveNumber = (value) => typeof value === 'number' && value >= 0;
const isValidArray = (arr) => Array.isArray(arr) && (arr === null || arr === void 0 ? void 0 : arr.length) > 0;
exports.FormValidations = {
    isValidString,
    isValidPositiveNumber,
    isValidArray
};
