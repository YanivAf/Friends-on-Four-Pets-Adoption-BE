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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.banToggleUser = exports.editUser = exports.showUserWithPets = exports.showUserContactInfo = exports.showUser = exports.showUsers = exports.login = exports.signup = void 0;
const jwt = require("jsonwebtoken");
const user_1 = require("../models/user");
const pet_1 = require("../models/pet");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.User(Object.assign(Object.assign({}, req.body), { publishedPets: [], savedPets: [], lovedPets: [], adoptedPets: [], fosteredPets: [], adoptedPending: [], fosteredPending: [], incomingRequests: [] }));
        const { _id } = yield user_1.Users.saveUser(user);
        const currentUserToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
            expiresIn: 7200,
        });
        res.send({ _id, token: currentUserToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.signup = signup;
const login = (req, res) => {
    try {
        const { userDoc } = req;
        const currentUserToken = jwt.sign({ _id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: 7200 });
        res.send({ userDoc, token: currentUserToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};
exports.login = login;
const showUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.Users.getAllUsers(req.body.limit);
        res.send(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.showUsers = showUsers;
const showUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.Users.getUserById(req.params.id, false);
        res.send(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.showUser = showUser;
const showUserContactInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publisher = yield user_1.Users.getUserById(req.params.id, true);
        res.send(publisher);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.showUserContactInfo = showUserContactInfo;
const showUserWithPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchedUserDoc } = req;
        const userPets = yield pet_1.Pets.getPetsByUser(req.params.id, searchedUserDoc.savedPets, req.body.limit);
        res.send({ user: searchedUserDoc, userPets });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.showUserWithPets = showUserWithPets;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editedUser = yield user_1.Users.editUser(req.params.id, req.body);
        res.send(editedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.editUser = editUser;
const banToggleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchedUserDoc } = req;
        if (!searchedUserDoc.banned)
            searchedUserDoc.banned = true;
        else
            searchedUserDoc.banned = false;
        const bannedUser = yield user_1.Users.saveUser(searchedUserDoc);
        res.send(bannedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.banToggleUser = banToggleUser;
const logout = (req, res) => {
    try {
        const { fullName } = req.userDoc;
        res.send({
            title: `Goodbye, ${fullName}!`,
            text: `See you next time!`
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};
exports.logout = logout;
//# sourceMappingURL=userControllers.js.map