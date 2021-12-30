export {};

import mongoose from "mongoose";
import { petSchema } from "../schemas/petSchemaMongoose";

export const Pet = mongoose.model("Pet", petSchema);

export class Pets {
  static async getPetsByProperties(
    properties: Array<{
      by: string;
      searchedValue: string | string[];
      minMax?: string;
    }>,
    limit: number
  ) {
    try {
      let findObj = {};
      let query;
      properties.forEach((property) => {
        if (property.minMax)
          query =
            property.minMax === "Min"
              ? { $gte: Number(property.searchedValue) }
              : { $lte: Number(property.searchedValue) };
        else if (Array.isArray(property.searchedValue)) {
          const caseInsesitiveArray = [];
          property.searchedValue.forEach((value) => {
            const caseInsesitiveValue = new RegExp(value, "i");
            caseInsesitiveArray.push(caseInsesitiveValue);
          });
          query = { $in: caseInsesitiveArray };
        } else query = { $regex: property.searchedValue, $options: "i" };
        findObj = { ...findObj, [property.by]: query };
      });
      const pets = await Pet.find(findObj)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select("-__v");

      return pets;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async getPetsByUser(
    userId: string,
    userSavedPets: string[],
    limit: number
  ) {
    // publisher / adopter / foster / savedPets
    try {
      const UserPets = await Pet.find({
        $or: [
          { publisher: userId },
          { adopter: userId },
          { foster: userId },
          ...(userSavedPets.length > 0
            ? [{ _id: { $in: userSavedPets } }]
            : []),
        ],
      })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select("-__v");
      return UserPets;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async getPetById(petId: string | mongoose.Types.ObjectId) {
    try {
      const _id =
        typeof petId === "string" ? new mongoose.Types.ObjectId(petId) : petId;
      const pet = await Pet.findById(_id).select("-__v");
      return pet;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async getPetByTypeNamePublisher(
    type: string,
    petName: string,
    publisher: string
  ) {
    try {
      const pet = await Pet.findOne({ type, petName, publisher }).select(
        "-__v"
      );
      return pet;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async savePet(pet) {
    try {
      let petToSave = new Pet(pet);
      petToSave._id = pet._id;
      const savedPet = await petToSave.save();
      return savedPet;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async editPet(
    petId: string | mongoose.Types.ObjectId,
    updatedData: any
  ) {
    try {
      const _id =
        typeof petId === "string" ? new mongoose.Types.ObjectId(petId) : petId;
      const editedPet = await Pet.findOneAndUpdate({ _id }, updatedData, {
        new: true,
      }).select("-__v");
      return editedPet;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }

  static async deletePetById(
    petId: string | mongoose.Types.ObjectId
  ): Promise<any | { error: string }> {
    try {
      const _id =
        typeof petId === "string" ? new mongoose.Types.ObjectId(petId) : petId;
      const pet = await Pet.deleteOne({ _id }).select("-__v");
      return pet;
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }
}
