"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const petSchemaBody_1 = require("../schemas/petSchemaBody");
const requestResponseSchemaBody_1 = require("../schemas/requestResponseSchemaBody");
const uploadImage_1 = require("../middlewares/uploadImage");
const validateBody_1 = require("../middlewares/validateBody");
const userMiddlewares_1 = require("../middlewares/userMiddlewares");
const petsMiddlewares_1 = require("../middlewares/petsMiddlewares");
const petControllers_1 = require("../controllers/petControllers");
router.route("/filtered").post(petControllers_1.showPets);
router
    .route("/")
    .post(userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userMiddlewares_1.isBanned, (0, validateBody_1.validateBody)(petSchemaBody_1.petSchema), petsMiddlewares_1.isDuplicate, petsMiddlewares_1.fixNonStringDataTypes, petControllers_1.addPet);
router
    .get("/user/:id", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userMiddlewares_1.isBanned, userMiddlewares_1.doesSearchedUserExist, petControllers_1.showUserPets)
    .post("/*", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userMiddlewares_1.isBanned)
    .put("/*", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userMiddlewares_1.isBanned)
    .delete("/*", userMiddlewares_1.isLoggedInAndAuthenticated, userMiddlewares_1.doesUserExist, userMiddlewares_1.isBanned);
router.all("/:id*", petsMiddlewares_1.doesPetExist);
router
    .route("/:id")
    .get(petControllers_1.showPet)
    .put(userMiddlewares_1.isSuperAdmin, userMiddlewares_1.onlyPublisher, petsMiddlewares_1.isPetAvailable, uploadImage_1.uploadImage.single("petPicture"), (0, validateBody_1.validateBody)(petSchemaBody_1.petSchema), petsMiddlewares_1.fixNonStringDataTypes, petControllers_1.editPet)
    .delete(userMiddlewares_1.isSuperAdmin, userMiddlewares_1.onlyPublisher, petsMiddlewares_1.isPetAvailable, petControllers_1.deletePet);
router.all("/:id/save", petsMiddlewares_1.isPetAlreadyInUserCollection);
router
    .route("/:id/save")
    .post(petsMiddlewares_1.publishedByAnother, petsMiddlewares_1.isPetNotAdopted, petControllers_1.addToPetsCollection)
    .delete(petControllers_1.removeFromPetsCollection);
router.all("/:id/love", petsMiddlewares_1.isPetAlreadyInUserCollection);
router
    .route("/:id/love")
    .post(petControllers_1.addToPetsCollection)
    .delete(petControllers_1.removeFromPetsCollection);
router
    .post("/:id/request", (0, validateBody_1.validateBody)(requestResponseSchemaBody_1.requestSchema), petsMiddlewares_1.publishedByAnother, petsMiddlewares_1.petCanBeRequested, petsMiddlewares_1.isPetAlreadyPendingByUser, petsMiddlewares_1.isPetAlreadyInUserCollection, petControllers_1.sendRequest)
    .post("/:id/respond", (0, validateBody_1.validateBody)(requestResponseSchemaBody_1.responseSchema), petsMiddlewares_1.doesRequestExist, petsMiddlewares_1.petCanBeRequested, petControllers_1.sendResponse)
    .post("/:id/return", petsMiddlewares_1.isPetFostered, userMiddlewares_1.isSuperAdmin, userMiddlewares_1.onlyFoster, petControllers_1.returnPet);
// function isWorking(req, res, next) {
//   console.log("working");
//   console.log(req.body);
//   next();
// }
exports.default = router;
//# sourceMappingURL=petRoutes.js.map