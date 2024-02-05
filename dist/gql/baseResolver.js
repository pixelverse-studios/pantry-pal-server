"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_1 = require("../utils/validations/form");
const User_1 = __importDefault(require("../models/User"));
class BaseResolver {
    constructor() {
        this.authToken = null;
        this.error = {};
        this.errors = {};
        this.addedErrors = null;
        this.catchErrorType = 'failure';
        this.typename = '';
        this.typenames = { single: '', multi: '' };
        this.validations = {
            form: form_1.FormValidations
        };
        this.payload = null;
        this.schemas = { User: User_1.default };
        const baseErrors = {
            notFound: (item) => ({
                type: 'notFound',
                message: `${item} not found`
            }),
            badInput: (field) => ({
                type: 'badInput',
                message: `${field} is required`
            }),
            //   someFieldsRequired: (fields: [string], item: string) => {
            //     const fieldsToString = fields.split()
            //     return {
            //       type: 'someFieldsRequired',
            //       message: `At least one of the following is required for ${item}: ${fieldsToString}`
            //     }
            //   },
            //   allFieldsRequired: (fields, item) => {
            //     const fieldsToString = fields.split()
            //     return {
            //       type: 'allFieldsRequired',
            //       message: `All of the following fields are required for ${item}: ${fieldsToString}`
            //     }
            //   },
            failedToMutate: (field, action) => ({
                type: 'failedToMutate',
                message: `Failed to ${action} ${field}`
            }),
            duplicateItem: (item) => ({
                type: 'duplicateItem',
                message: `${item} already exists`
            })
        };
        this.errors = Object.assign({}, baseErrors);
    }
    catchError(action) {
        return {
            __typename: this.catchErrorType,
            message: `There was an issue ${action}. Please try again`
        };
    }
    handleError() {
        return Object.assign({ __typename: 'Errors' }, this.error);
    }
    handleSingleItemSuccess(values) {
        return Object.assign({ __typename: this.typenames.single }, values._doc);
    }
    handleMultiItemSuccess(key, values) {
        return {
            __typename: this.typenames.multi,
            [key]: values
        };
    }
    buildPayload(params, source) {
        const payload = {};
        Object.entries(params).forEach(([key, value]) => {
            if (value !== source[key]) {
                payload[key] = value;
            }
        });
        return (this.payload = payload);
    }
}
exports.default = BaseResolver;
