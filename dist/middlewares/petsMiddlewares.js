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
exports.isPetAlreadyInUserCollection = exports.isPetNotAdopted = exports.isPetFostered = exports.isPetAvailable = exports.isPetAlreadyPendingByUser = exports.petCanBeRequested = exports.doesRequestExist = exports.publishedByAnother = exports.doesPetExist = exports.fixNonStringDataTypes = exports.isDuplicate = void 0;
const pet_1 = require("../models/pet");
const user_1 = require("../models/user");
const isDuplicate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, petName } = req.body;
        const { _id } = req.userDoc;
        const possibleDuplicatePet = yield pet_1.Pets.getPetByTypeNamePublisher(type, petName, _id);
        if (!possibleDuplicatePet)
            next();
        else
            res
                .status(409)
                .send({
                message: `Publishing more than one pet of same type with same name is not allowed`,
            });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.isDuplicate = isDuplicate;
function fixNonStringDataTypes(req, res, next) {
    try {
        const { height, weight, hypoallergenic } = req.body;
        if (height !== "" && !isNaN(height))
            req.height = Number(height);
        if (weight !== "" && !isNaN(weight))
            req.weight = Number(weight);
        if (Number(hypoallergenic) === 0 || Number(hypoallergenic) === 1)
            req.hypoallergenic = Number(hypoallergenic) ? true : false;
        if ((req.height !== undefined && isNaN(req.height)) ||
            (req.weight !== undefined && isNaN(req.weight)) ||
            (req.hypoallergenic !== undefined &&
                typeof req.hypoallergenic !== "boolean"))
            res
                .status(422)
                .send({ message: "One or more invalid numeric/boolean data provided" });
        else
            next();
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
}
exports.fixNonStringDataTypes = fixNonStringDataTypes;
const doesPetExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params.id) {
            const petDoc = yield pet_1.Pets.getPetById(req.params.id);
            if (petDoc) {
                req.petDoc = petDoc;
                next();
            }
            else
                res.status(409).send({ message: `Pet wasn't found...` });
        }
        else
            res.status(400).send({ message: `Expected pet id` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.doesPetExist = doesPetExist;
const publishedByAnother = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userDoc, petDoc } = req;
        if (userDoc._id.toString() !== petDoc.publisher)
            next();
        else
            res
                .status(409)
                .send({ message: `You cannot do this action for your own pets` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.publishedByAnother = publishedByAnother;
const doesRequestExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { incomingRequests } = req.userDoc;
        const { requestId } = req.body;
        const requestIndex = incomingRequests.findIndex((incomingRequest) => incomingRequest._id.toString() === requestId);
        if (requestIndex !== -1) {
            req.requestIndex = requestIndex;
            next();
        }
        else
            res.status(409).send({ message: `The request was not found` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.doesRequestExist = doesRequestExist;
const petCanBeRequested = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, response } = req.body;
        const { adoptionStatus, foster } = req.petDoc;
        if (adoptionStatus === "Available")
            return next();
        else if (adoptionStatus === "Fostered") {
            const userIdToCheck = response
                ? req.userDoc.incomingRequests[req.requestIndex].by
                : req.userDoc._id.toString();
            if (userIdToCheck === foster) {
                if (type !== "Foster")
                    return next();
            }
        }
        else if (response)
            yield user_1.Users.removeRequestsByPet(req.params.id, req.userDoc);
        res.status(409).send({ message: `Pet was already ${adoptionStatus}` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.petCanBeRequested = petCanBeRequested;
const isPetAlreadyPendingByUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adoptedPending, fosteredPending } = req.userDoc;
        const pendingForAdoptionIndex = adoptedPending.findIndex((petRequested) => petRequested === req.params.id);
        const pendingForFosteringIndex = fosteredPending.findIndex((petRequested) => petRequested === req.params.id);
        if (pendingForAdoptionIndex === -1 && pendingForFosteringIndex === -1)
            next();
        else
            res
                .status(409)
                .send({
                message: `You've already filed a request for this pet. Please wait for the response`,
            });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.isPetAlreadyPendingByUser = isPetAlreadyPendingByUser;
const isPetAvailable = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adoptionStatus } = req.petDoc;
        if (adoptionStatus === "Available")
            next();
        else
            res.status(409).send({ message: `Only available pets can be modified` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.isPetAvailable = isPetAvailable;
const isPetFostered = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adoptionStatus } = req.petDoc;
        if (adoptionStatus === "Fostered")
            next();
        else if (adoptionStatus === "Adopted")
            res.status(409).send({ message: `Adopted pets cannot be returned!` });
        else
            res.status(409).send({ message: `Only fostered pets can be returned` });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.isPetFostered = isPetFostered;
const isPetNotAdopted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adoptionStatus } = req.petDoc;
        if (adoptionStatus !== "Adopted")
            next();
        else {
            yield user_1.Users.removePetFromSaved(req.params.id, req.userDoc);
            res.status(409).send({ message: `Adopted pets cannot be saved` });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.isPetNotAdopted = isPetNotAdopted;
const isPetAlreadyInUserCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saveOrLove = req.path.slice(-4);
        const { savedPets, lovedPets } = req.userDoc;
        const petCollection = saveOrLove.toLowerCase() === "save" || saveOrLove.toLowerCase() === "uest"
            ? savedPets
            : lovedPets;
        req.saveOrLove =
            saveOrLove.toLowerCase() === "save" || saveOrLove.toLowerCase() === "uest"
                ? "savedPets"
                : "lovedPets";
        const collectionPetIndex = petCollection.findIndex((collectionPet) => collectionPet === req.params.id);
        if (req.method === "POST") {
            if (collectionPetIndex === -1) {
                if (saveOrLove.toLowerCase() === "uest") {
                    // save requested pet
                    req.userDoc[req.saveOrLove].push(req.params.id);
                    req.userDoc = yield user_1.Users.saveUser(req.userDoc);
                }
                next();
            }
            else {
                if (saveOrLove.toLowerCase() === "uest")
                    next();
                else
                    res
                        .status(409)
                        .send({ message: `You've already ${saveOrLove}d this pet` });
            }
        }
        else {
            // req.method === DELETE
            if (collectionPetIndex !== -1) {
                req.PetToRemoveFromCollectionIndex = collectionPetIndex;
                next();
            }
            else
                res
                    .status(409)
                    .send({ message: `This pet is not in your ${saveOrLove}d pets` });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
exports.isPetAlreadyInUserCollection = isPetAlreadyInUserCollection;
//# sourceMappingURL=petsMiddlewares.js.map