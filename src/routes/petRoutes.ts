export {};
import express from "express";
const router = express.Router();

import { petSchema } from "../schemas/petSchemaBody";
import {
  requestSchema,
  responseSchema,
} from "../schemas/requestResponseSchemaBody";
import { uploadImage } from "../middlewares/uploadImage";
import { validateBody } from "../middlewares/validateBody";
import {
  isLoggedInAndAuthenticated,
  doesUserExist,
  doesSearchedUserExist,
  isSuperAdmin,
  onlyFoster,
  onlyPublisher,
  isBanned,
} from "../middlewares/userMiddlewares";
import {
  isDuplicate,
  fixNonStringDataTypes,
  doesPetExist,
  publishedByAnother,
  doesRequestExist,
  petCanBeRequested,
  isPetAlreadyPendingByUser,
  isPetAvailable,
  isPetFostered,
  isPetNotAdopted,
  isPetAlreadyInUserCollection,
  getCloudImgUrl
} from "../middlewares/petsMiddlewares";
import {
  showPets,
  showUserPets,
  showPet,
  addToPetsCollection,
  removeFromPetsCollection,
  addPet,
  editPet,
  sendRequest,
  sendResponse,
  returnPet,
  deletePet,
} from "../controllers/petControllers";

router.route("/filtered").post(showPets);

router
  .route("/")
  .post(
    isLoggedInAndAuthenticated,
    doesUserExist,
    isBanned,
    validateBody(petSchema),
    isDuplicate,
    fixNonStringDataTypes,
    addPet
  );

router
  .get(
    "/user/:id",
    isLoggedInAndAuthenticated,
    doesUserExist,
    isBanned,
    doesSearchedUserExist,
    showUserPets
  )
  .post("/*", isLoggedInAndAuthenticated, doesUserExist, isBanned)
  .put("/*", isLoggedInAndAuthenticated, doesUserExist, isBanned)
  .delete("/*", isLoggedInAndAuthenticated, doesUserExist, isBanned);

router.all("/:id*", doesPetExist);

router
  .route("/:id")
  .get(showPet)
  .put(
    isSuperAdmin,
    onlyPublisher,
    isPetAvailable,
    uploadImage.single("petPicture"),
    getCloudImgUrl,
    validateBody(petSchema),
    fixNonStringDataTypes,
    editPet
  )
  .delete(isSuperAdmin, onlyPublisher, isPetAvailable, deletePet);

router.all("/:id/save", isPetAlreadyInUserCollection);

router
  .route("/:id/save")
  .post(publishedByAnother, isPetNotAdopted, addToPetsCollection)
  .delete(removeFromPetsCollection);

router.all("/:id/love", isPetAlreadyInUserCollection);

router
  .route("/:id/love")
  .post(addToPetsCollection)
  .delete(removeFromPetsCollection);

router
  .post(
    "/:id/request",
    validateBody(requestSchema),
    publishedByAnother,
    petCanBeRequested,
    isPetAlreadyPendingByUser,
    isPetAlreadyInUserCollection,
    sendRequest
  )
  .post(
    "/:id/respond",
    validateBody(responseSchema),
    doesRequestExist,
    petCanBeRequested,
    sendResponse
  )
  .post("/:id/return", isPetFostered, isSuperAdmin, onlyFoster, returnPet);

// function isWorking(req, res, next) {
//   console.log("working");
//   console.log(req.body);
//   next();
// }

export default router;
