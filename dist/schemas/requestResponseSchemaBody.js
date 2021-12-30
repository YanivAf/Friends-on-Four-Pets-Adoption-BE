"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseSchema = exports.requestSchema = void 0;
exports.requestSchema = {
    type: "object",
    properties: {
        type: { type: "string", enum: ["Adopt", "Foster"] },
    },
    required: ["type"],
    additionalProperties: false,
};
exports.responseSchema = {
    type: "object",
    properties: {
        response: { type: "string", enum: ["Accept", "Decline"] },
        requestId: { type: "string", pattern: "^[a-f0-9]{24}$" },
    },
    required: ["response", "requestId"],
    additionalProperties: false,
};
//# sourceMappingURL=requestResponseSchemaBody.js.map