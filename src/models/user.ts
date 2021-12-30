export {};

import mongoose from "mongoose";
import { userSchema } from "../schemas/userSchemaMongoose";

export const User = mongoose.model("User", userSchema);

export class Users {
  static async getAllUsers(limit: number) {
    try {
      const allUsers = User.find()
        .sort({ updatedAt: -1 })
        .select("-password -passwordConfirm")
        .limit(limit);
      return allUsers;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async getUserById(userId, contactInfoOnly: boolean) {
    try {
      const selection = contactInfoOnly
        ? "_id fullName phone email"
        : "-password -passwordConfirm -__v -updatedAt -createdAt";
      const _id =
        typeof userId === "string"
          ? new mongoose.Types.ObjectId(userId)
          : userId;
      const user = await User.findById(_id).select(selection);
      user;
      return user;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email }).select(
        "-passwordConfirm -__v -updatedAt -createdAt"
      );
      return user;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async saveUser(user) {
    try {
      const savedUser = await user.save();
      return savedUser;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async editUser(userId, updatedData) {
    try {
      const editedUser = await User.findOneAndUpdate(
        { _id: userId },
        updatedData,
        { new: true }
      ).select("-password -passwordConfirm -__v -updatedAt -createdAt");
      return editedUser;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async removeRequestsByPet(petId, user) {
    try {
      const updatedRequests = user.incomingRequests.filter(
        (incomingRequest) => incomingRequest.pet !== petId
      );
      user.incomingRequests = updatedRequests;
      this.saveUser(user);
      return user;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async removePetFromSaved(petId, user) {
    try {
      user.savedPets.filter((savedPet) => savedPet === petId);
      this.saveUser(user);
      return user;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }
}
