"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pets = exports.Pet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const petSchemaMongoose_1 = require("../schemas/petSchemaMongoose");
exports.Pet = mongoose_1.default.model("Pet", petSchemaMongoose_1.petSchema);
class Pets {
    static getPetsByProperties(properties, limit) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    }
                    else
                        query = { $regex: property.searchedValue, $options: "i" };
                    findObj = Object.assign(Object.assign({}, findObj), { [property.by]: query });
                });
                const pets = yield exports.Pet.find(findObj)
                    .sort({ updatedAt: -1 })
                    .limit(limit)
                    .select("-__v");
                return pets;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static getPetsByUser(userId, userSavedPets, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            // publisher / adopter / foster / savedPets
            try {
                const UserPets = yield exports.Pet.find({
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
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static getPetById(petId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = typeof petId === "string" ? new mongoose_1.default.Types.ObjectId(petId) : petId;
                const pet = yield exports.Pet.findById(_id).select("-__v");
                return pet;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static getPetByTypeNamePublisher(type, petName, publisher) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pet = yield exports.Pet.findOne({ type, petName, publisher }).select("-__v");
                return pet;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static savePet(pet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let petToSave = new exports.Pet(pet);
                petToSave._id = pet._id;
                const savedPet = yield petToSave.save();
                return savedPet;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static editPet(petId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = typeof petId === "string" ? new mongoose_1.default.Types.ObjectId(petId) : petId;
                const editedPet = yield exports.Pet.findOneAndUpdate({ _id }, updatedData, {
                    new: true,
                }).select("-__v");
                return editedPet;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static deletePetById(petId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = typeof petId === "string" ? new mongoose_1.default.Types.ObjectId(petId) : petId;
                const pet = yield exports.Pet.deleteOne({ _id }).select("-__v");
                return pet;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
}
exports.Pets = Pets;
//# sourceMappingURL=pet.js.map