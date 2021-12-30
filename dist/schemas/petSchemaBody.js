"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petSchema = void 0;
exports.petSchema = {
    type: "object",
    properties: {
        type: { type: "string", minLength: 3, maxLength: 20 },
        petName: { type: "string", pattern: "^[a-zA-Z&() ]{2,40}$" },
        bio: { type: "string", minLength: 20, maxLength: 200 },
        breed: { type: "string", minLength: 3, maxLength: 20 },
        height: { type: "string", minLength: 1, maxLength: 3 },
        weight: { type: "string", minLength: 1, maxLength: 3 },
        color: { type: "string", pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$" },
        hypoallergenic: { type: "string", pattern: "^[0-1]$" },
        dietaryRestrictions: { type: "string", minLength: 10, maxLength: 80 },
    },
    required: ["type", "petName", "bio"],
    additionalProperties: true,
};
//# sourceMappingURL=petSchemaBody.js.map