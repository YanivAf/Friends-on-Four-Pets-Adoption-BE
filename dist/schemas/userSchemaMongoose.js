"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RequestSchema = new Schema(
/*<UserDocument, Model<UserDocument>>*/ {
    type: { type: String, enum: ["Adopt", "Foster"], required: true },
    by: { type: String, required: true },
    byName: { type: String, required: true },
    byPhone: { type: String, required: true },
    byEmail: { type: String, required: true },
    pet: { type: String, required: true },
    petName: { type: String, required: true },
}, { timestamps: true });
exports.userSchema = new Schema({
    admin: { type: Boolean, required: false },
    banned: { type: Boolean, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    area: { type: String, required: false },
    bio: { type: String, required: false },
    recentlyApproved: { type: Number, required: false },
    lovedPets: { type: [String], required: true },
    savedPets: { type: [String], required: true },
    publishedPets: { type: [String], required: true },
    adoptedPets: { type: [String], required: true },
    fosteredPets: { type: [String], required: true },
    adoptedPending: { type: [String], required: true },
    fosteredPending: { type: [String], required: true },
    incomingRequests: { type: [RequestSchema], required: true },
}, { timestamps: true });
//# sourceMappingURL=userSchemaMongoose.js.map