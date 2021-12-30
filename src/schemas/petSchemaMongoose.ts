export {};

import mongoose, { Document, Model } from "mongoose";
const Schema = mongoose.Schema;

export interface PetDocument extends Document {
  type: string;
  petName: string;
  bio: string;
  adoptionStatus: string;
  loves: number;
  petPicture: string;
  breed?: string;
  height?: number;
  weight?: number;
  color?: string;
  hypoallergenic?: boolean;
  dietaryRestrictions?: string;
  publisher: string;
  adopter?: string;
  foster?: string;
}

export const petSchema = new Schema(
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
  },
  { timestamps: true }
);
