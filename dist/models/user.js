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
exports.Users = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchemaMongoose_1 = require("../schemas/userSchemaMongoose");
exports.User = mongoose_1.default.model("User", userSchemaMongoose_1.userSchema);
class Users {
    static getAllUsers(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = exports.User.find()
                    .sort({ updatedAt: -1 })
                    .select("-password -passwordConfirm")
                    .limit(limit);
                return allUsers;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static getUserById(userId, contactInfoOnly) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selection = contactInfoOnly
                    ? "_id fullName phone email"
                    : "-password -passwordConfirm -__v -updatedAt -createdAt";
                const _id = typeof userId === "string"
                    ? new mongoose_1.default.Types.ObjectId(userId)
                    : userId;
                const user = yield exports.User.findById(_id).select(selection);
                user;
                return user;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield exports.User.findOne({ email }).select("-passwordConfirm -__v -updatedAt -createdAt");
                return user;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedUser = yield user.save();
                return savedUser;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static editUser(userId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editedUser = yield exports.User.findOneAndUpdate({ _id: userId }, updatedData, { new: true }).select("-password -passwordConfirm -__v -updatedAt -createdAt");
                return editedUser;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static removeRequestsByPet(petId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedRequests = user.incomingRequests.filter((incomingRequest) => incomingRequest.pet !== petId);
                user.incomingRequests = updatedRequests;
                this.saveUser(user);
                return user;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
    static removePetFromSaved(petId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                user.savedPets.filter((savedPet) => savedPet === petId);
                this.saveUser(user);
                return user;
            }
            catch (err) {
                console.error(err);
                return { error: err.message };
            }
        });
    }
}
exports.Users = Users;
//# sourceMappingURL=user.js.map