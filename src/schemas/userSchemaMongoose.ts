export {};

import mongoose, { Document, Model } from "mongoose";
const Schema = mongoose.Schema;

export interface RequestDocument extends Document {
  type: string;
  by: string;
  pet: string;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  area?: string;
  bio?: string;
  lovedPets: string[];
  savedPets: string[];
  publishedPets: string[];
  adoptedPets: string[];
  fosteredPets: string[];
  adoptedPending: string[];
  fosteredPending: string[];
  incomingRequests: RequestDocument[];
}

const RequestSchema = new Schema(
  /*<UserDocument, Model<UserDocument>>*/ {
    type: { type: String, enum: ["Adopt", "Foster"], required: true },
    by: { type: String, required: true },
    byName: { type: String, required: true },
    byPhone: { type: String, required: true },
    byEmail: { type: String, required: true },
    pet: { type: String, required: true },
    petName: { type: String, required: true },
  },
  { timestamps: true }
);

export const userSchema = new Schema(
  {
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
  },
  { timestamps: true }
);
