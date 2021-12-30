"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.petSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.petSchema = new Schema(
/*<PetDocument, Model<PetDocument>>*/ {
    type: { type: String, required: true },
    petName: { type: String, required: true },
    bio: { type: String, required: true },
    adoptionStatus: {
        type: String,
        enum: ["Adopted", "Fostered", "Available"],
        required: true,
    },
    loves: { type: Number, required: true },
    petPicture: { type: String, required: true },
    breed: { type: String, required: false },
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    color: { type: String, required: false },
    hypoallergenic: { type: Boolean, required: false },
    dietaryRestrictions: { type: String, required: false },
    publisher: { type: String, required: true },
    adopter: { type: String, required: false },
    foster: { type: String, required: false },
}, { timestamps: true });
//# sourceMappingURL=petSchemaMongoose.js.map