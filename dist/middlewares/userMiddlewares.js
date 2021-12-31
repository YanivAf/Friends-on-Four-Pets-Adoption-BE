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
exports.onlyFoster = exports.onlyPublisher = exports.onlySuperAdmin = exports.isSuperAdmin = exports.hasPermissions = exports.validatePassword = exports.encryptPassword = exports.confirmPassword = exports.isBanned = exports.isPasswordPassed = exports.doesEmailExist = exports.OtherAdminBanningAttempt = exports.doesSearchedUserExist = exports.doesUserExist = exports.isLoggedInAndAuthenticated = void 0;
const user_1 = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isLoggedInAndAuthenticated = (req, res, next) => {
    try {
        const authHeaders = req.headers['currentuser'];
        console.log(req.headers.currentuser);
        if (!authHeaders) {
            res.status(401).send({ message: "The session has expired. Please log in again" });
            return;
        }
        const currentUser = authHeaders.replace('Bearer ', '');
        if (currentUser) {
            jwt.verify(currentUser, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).send({
                        message: "You are not authorized to see this page, mister hacker...",
                    });
                    return;
                }
                req.currentUser = decoded;
                next();
            });
        }
        else
            res
                .status(401)
                .send({ message: "The session has expired. Please log in again" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
};
exports.isLoggedInAndAuthenticated = isLoggedInAndAuthenticated;
const doesUserExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUser } = req;
        if (currentUser) {
            // current user actions
            const { _id } = currentUser;
            const userDoc = yield user_1.Users.getUserById(_id, false);
            if (userDoc) {
                req.userDoc = userDoc;
                next();
            }
            else {
                res
                    .status(401)
                    .send({ message: `User wasn't found, mister hacker...` });
            }
            return;
        }
        const { email, passwordConfirm } = req.body;
        const userDoc = yield user_1.Users.getUserByEmail(email);
        if (passwordConfirm) {
            // signup
            if (userDoc)
                res.status(409).send({
                    message: `Email already registered. Please use a different one`,
                });
            else
                next();
        }
        else {
            // login
            if (userDoc) {
                req.userDoc = userDoc;
                next();
            }
            else
                res.status(409).send({
                    message: `Email not registered. Please check for typos or register`,
                });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.doesUserExist = doesUserExist;
const doesSearchedUserExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params.id) {
            const searchedUser = yield user_1.Users.getUserById(req.params.id, false);
            if (searchedUser) {
                req.searchedUserDoc = searchedUser;
                next();
            }
            else
                res.status(404).send({ message: `User wasn't found...` });
            return;
        }
        else
            res.status(400).send({ message: `Expected user id` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.doesSearchedUserExist = doesSearchedUserExist;
const OtherAdminBanningAttempt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchedUserDoc } = req;
        if (searchedUserDoc.admin !== true)
            next();
        else
            res.status(403).send({ message: `Banning other admins is not allowed` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.OtherAdminBanningAttempt = OtherAdminBanningAttempt;
const doesEmailExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, email } = req.body;
        const userDoc = yield user_1.Users.getUserByEmail(email);
        if (userDoc) {
            if (userDoc._id.toString() === _id)
                next();
            else
                res.status(409).send({
                    message: `Email already registered. Please use a different one`,
                });
        }
        else
            next();
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.doesEmailExist = doesEmailExist;
function isPasswordPassed(req, res, next) {
    try {
        const { password } = req.body;
        if (password === undefined) {
            if (req.params.id === undefined)
                res.status(422).send({ message: `Password is a required feild` });
            else {
                req.editPasswordAttempt = false;
                next();
            }
        }
        else {
            if (req.params.id === undefined)
                next();
            else {
                req.editPasswordAttempt = true;
                next();
            }
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
exports.isPasswordPassed = isPasswordPassed;
function isBanned(req, res, next) {
    try {
        const { userDoc } = req;
        if (userDoc.banned)
            res.status(403).send({ message: `User is banned from the system` });
        else
            next();
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
exports.isBanned = isBanned;
function confirmPassword(req, res, next) {
    try {
        if (req.params.id && !req.editPasswordAttempt)
            next();
        else {
            const { password, passwordConfirm } = req.body;
            if (password !== passwordConfirm)
                res.status(409).send({
                    message: `Password confirmation failed. Make sure both entries match`,
                });
            else
                next();
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
exports.confirmPassword = confirmPassword;
const encryptPassword = (req, res, next) => {
    try {
        if (req.editPasswordAttempt === false)
            return next();
        const { password } = req.body;
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err)
                throw new Error("Issues in the password encryption process");
            req.body.password = hash;
            next();
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
};
exports.encryptPassword = encryptPassword;
const validatePassword = (req, res, next) => {
    try {
        const { password } = req.body;
        const { userDoc } = req;
        bcrypt.compare(password, userDoc.password, (err, result) => {
            if (err)
                throw res
                    .status(409)
                    .send({ message: "The password you entered is incorrect" });
            else if (result) {
                next();
            }
            else
                res
                    .status(409)
                    .send({ message: "The password you entered is incorrect" });
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
};
exports.validatePassword = validatePassword;
const hasPermissions = (req, res, next) => {
    try {
        const { userDoc, petDoc } = req;
        if (userDoc._id.toString() === petDoc.publisher || req.superAdmin)
            next();
        else
            res
                .status(403)
                .send({ message: `You don't have permissions for this action` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
};
exports.hasPermissions = hasPermissions;
const isSuperAdmin = (req, res, next) => {
    try {
        const { userDoc } = req;
        req.superAdmin = userDoc.admin === true;
        next();
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
};
exports.isSuperAdmin = isSuperAdmin;
const onlySuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.superAdmin)
            next();
        else
            res
                .status(403)
                .send({ message: `You don't have permissions for this action` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.onlySuperAdmin = onlySuperAdmin;
const onlyPublisher = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userDoc, petDoc } = req;
        if (userDoc._id.toString() === petDoc.publisher)
            next();
        else if (req.superAdmin) {
            const publisherUserDoc = yield user_1.Users.getUserById(petDoc.publisher, false);
            if (publisherUserDoc) {
                req.publisherUserDoc = publisherUserDoc;
                next();
            }
            else
                res.status(404).send({ message: `Publisher user wasn't found` });
        }
        else
            res
                .status(403)
                .send({ message: `You don't have permissions for this action` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.onlyPublisher = onlyPublisher;
const onlyFoster = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userDoc, petDoc } = req;
        if (userDoc._id.toString() === petDoc.foster)
            next();
        else if (req.superAdmin) {
            const fosterUserDoc = yield user_1.Users.getUserById(petDoc.foster, false);
            if (fosterUserDoc) {
                req.fosterUserDoc = fosterUserDoc;
                next();
            }
            else
                res.status(404).send({ message: `Foster user wasn't found` });
        }
        else
            res
                .status(403)
                .send({ message: `You don't have permissions for this action` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.onlyFoster = onlyFoster;
//# sourceMappingURL=userMiddlewares.js.map