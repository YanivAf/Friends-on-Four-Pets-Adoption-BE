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
exports.deletePet = exports.returnPet = exports.sendResponse = exports.sendRequest = exports.editPet = exports.addPet = exports.removeFromPetsCollection = exports.addToPetsCollection = exports.showPet = exports.showUserPets = exports.showPets = void 0;
const pet_1 = require("../models/pet");
const user_1 = require("../models/user");
const showPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { properties, limit } = req.body;
        const pets = yield pet_1.Pets.getPetsByProperties(properties, limit);
        res.send(pets);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.showPets = showPets;
const showUserPets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchedUserDoc, userDoc } = req;
        if (searchedUserDoc._id.toString() === userDoc._id.toString()) {
            searchedUserDoc.recentlyApproved = 0;
            yield user_1.Users.saveUser(searchedUserDoc);
        }
        const userPets = yield pet_1.Pets.getPetsByUser(req.params.id, searchedUserDoc.savedPets, req.body.limit);
        res.send(userPets);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.showUserPets = showUserPets;
const showPet = (req, res) => {
    try {
        res.send({ pet: req.petDoc });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};
exports.showPet = showPet;
const addToPetsCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { petDoc, userDoc, saveOrLove } = req;
        userDoc[saveOrLove].push(req.params.id);
        const currentUser = yield user_1.Users.saveUser(userDoc);
        let lovedPet = petDoc;
        if (saveOrLove === "lovedPets") {
            petDoc.loves++;
            lovedPet = yield pet_1.Pets.savePet(petDoc);
        }
        res.send({ [saveOrLove]: userDoc[saveOrLove], loves: lovedPet.loves });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.addToPetsCollection = addToPetsCollection;
const removeFromPetsCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { petDoc, userDoc, saveOrLove, PetToRemoveFromCollectionIndex } = req;
        userDoc[saveOrLove].splice(PetToRemoveFromCollectionIndex, 1);
        const currentUser = yield user_1.Users.saveUser(userDoc);
        let unlovedPet = petDoc;
        if (saveOrLove === "lovedPets") {
            petDoc.loves--;
            unlovedPet = yield pet_1.Pets.savePet(petDoc);
        }
        res.send({ [saveOrLove]: userDoc[saveOrLove], loves: unlovedPet.loves });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.removeFromPetsCollection = removeFromPetsCollection;
const addPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { height, weight, hypoallergenic } = req;
        const pet = new pet_1.Pet(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), (req.body.height !== undefined ? height : { height: 0 })), (req.body.weight !== undefined ? weight : { weight: 0 })), (req.body.hypoallergenic !== undefined && hypoallergenic)), { adoptionStatus: "Available", loves: 0, petPicture: "public\\images\\default.png", publisher: req.userDoc._id, adopter: null, foster: null }));
        const newPet = yield pet_1.Pets.savePet(pet);
        const { userDoc } = req;
        userDoc.publishedPets.push(pet._id.toString());
        yield user_1.Users.saveUser(userDoc);
        res.send(newPet);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.addPet = addPet;
const editPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { height, weight, hypoallergenic } = req;
        const petPicture = req.file ? req.file.path : req.petDoc.petPicture;
        const updatedData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), (req.body.height !== undefined && height)), (req.body.weight !== undefined && weight)), (req.body.hypoallergenic !== undefined && hypoallergenic)), { petPicture });
        const editedPet = yield pet_1.Pets.editPet(req.petDoc._id, updatedData);
        res.send(editedPet);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.editPet = editPet;
const sendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        if (type !== "Adopt" && type !== "Foster")
            throw new Error("The request type is invalid");
        const { userDoc, petDoc } = req;
        if (type === "Adopt")
            userDoc.adoptedPending.push(petDoc._id);
        else
            userDoc.fosteredPending.push(petDoc._id);
        const currentUser = yield user_1.Users.saveUser(userDoc);
        const petPublisher = yield user_1.Users.getUserById(petDoc.publisher, false);
        const request = {
            type,
            by: userDoc._id.toString(),
            byName: userDoc.fullName,
            byPhone: userDoc.phone,
            byEmail: userDoc.email,
            pet: petDoc._id.toString(),
            petName: petDoc.petName,
        };
        petPublisher.incomingRequests.push(request);
        const petPublisherUser = yield user_1.Users.saveUser(petPublisher);
        res.send(currentUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.sendRequest = sendRequest;
const sendResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { response } = req.body;
        const { userDoc, petDoc, requestIndex } = req;
        const request = userDoc.incomingRequests[requestIndex];
        const petRequester = yield user_1.Users.getUserById(request.by, false);
        const relevantPets = request.type === "Adopt" ? "adoptedPets" : "fosteredPets";
        const relevantPending = request.type === "Adopt" ? "adoptedPending" : "fosteredPending";
        const relevantRequster = request.type === "Adopt" ? "adopter" : "foster";
        const updatedPending = petRequester[relevantPending].filter((pending) => pending !== petDoc._id.toString());
        const updatedSaved = petRequester.savedPets.filter((saved) => saved !== petDoc._id.toString());
        petRequester[relevantPending] = updatedPending;
        petRequester.savedPets = updatedSaved;
        if (response === "Accept") {
            petDoc[relevantRequster] = petRequester._id.toString();
            petRequester[relevantPets].push(petDoc._id);
            petRequester.recentlyApproved
                ? petRequester.recentlyApproved++
                : (petRequester.recentlyApproved = 1);
            petDoc.adoptionStatus = `${request.type}ed`;
        }
        userDoc.incomingRequests.splice(requestIndex, 1);
        const { phone, email, fullName } = yield user_1.Users.saveUser(petRequester);
        const { petName, adoptionStatus } = yield pet_1.Pets.savePet(petDoc);
        const currentUser = yield user_1.Users.saveUser(userDoc);
        res.send({
            petDetails: { petName, adoptionStatus },
            requesterContactDetails: { phone, email, fullName },
            response,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.sendResponse = sendResponse;
const returnPet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userDoc, petDoc, fosterUserDoc } = req;
        const affectedUser = fosterUserDoc ? fosterUserDoc : userDoc;
        const updatedFosteredPets = affectedUser.fosteredPets.filter((pet) => pet.toString() !== petDoc._id.toString());
        affectedUser.fosteredPets = updatedFosteredPets;
        petDoc.foster = null;
        petDoc.adoptionStatus = "Available";
        yield pet_1.Pets.savePet(petDoc);
        const currentUser = yield user_1.Users.saveUser(affectedUser);
        res.send(currentUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.returnPet = returnPet;
const deletePet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { petDoc } = req;
        const deleteOperation = yield pet_1.Pets.deletePetById(petDoc._id);
        res.send({ pet: req.petDoc, deleted: deleteOperation.deletedCount });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});
exports.deletePet = deletePet;
//# sourceMappingURL=petControllers.js.map