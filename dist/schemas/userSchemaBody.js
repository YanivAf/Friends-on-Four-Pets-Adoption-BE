"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
exports.userSchema = {
    type: "object",
    properties: {
        _id: { type: "string" },
        email: { type: "string", format: "email" },
        password: {
            type: "string",
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        },
        passwordConfirm: {
            type: "string",
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        },
        fullName: {
            type: "string",
            pattern: "^[a-zA-Z]{2,20}[.]?[ ][a-zA-Z]{2,20}([.]?[ ][a-zA-Z]{2,20})?$",
        },
        phone: {
            type: "string",
            pattern: "^([0]|[+]?972[-]?)(([2-4]|[6-9])|([5][1-9]))[-]?[1-9][0-9]{3}[-]?[0-9]{3}$",
        },
        area: { type: "string", maxLength: 30 },
        bio: { type: "string", minLength: 20, maxLength: 200 },
    },
    required: ["email"],
    additionalProperties: true,
};
//# sourceMappingURL=userSchemaBody.js.map