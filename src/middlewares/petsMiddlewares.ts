export {};

import { Pets } from "../models/pet";
import { Users } from "../models/user";
import { uploadToCloudinary } from "./cloudinaryUpload";

export const isDuplicate = async (req, res, next) => {
  try {
    const { type, petName } = req.body;
    const { _id } = req.userDoc;
    const possibleDuplicatePet = await Pets.getPetByTypeNamePublisher(
      type,
      petName,
      _id
    );
    if (!possibleDuplicatePet) next();
    else
      res
        .status(409)
        .send({
          message: `Publishing more than one pet of same type with same name is not allowed`,
        });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export function fixNonStringDataTypes(req, res, next) {
  try {
    const { height, weight, hypoallergenic } = req.body;
    if (height !== "" && !isNaN(height)) req.height = Number(height);
    if (weight !== "" && !isNaN(weight)) req.weight = Number(weight);
    if (Number(hypoallergenic) === 0 || Number(hypoallergenic) === 1)
      req.hypoallergenic = Number(hypoallergenic) ? true : false;

    if (
      (req.height !== undefined && isNaN(req.height)) ||
      (req.weight !== undefined && isNaN(req.weight)) ||
      (req.hypoallergenic !== undefined &&
        typeof req.hypoallergenic !== "boolean")
    )
      res
        .status(422)
        .send({ message: "One or more invalid numeric/boolean data provided" });
    else next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
}

export const doesPetExist = async (req, res, next) => {
  try {
    if (req.params.id) {
      const petDoc = await Pets.getPetById(req.params.id);
      if (petDoc) {
        req.petDoc = petDoc;
        next();
      } else res.status(409).send({ message: `Pet wasn't found...` });
    } else res.status(400).send({ message: `Expected pet id` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const publishedByAnother = async (req, res, next) => {
  try {
    const { userDoc, petDoc } = req;
    if (userDoc._id.toString() !== petDoc.publisher) next();
    else
      res
        .status(409)
        .send({ message: `You cannot do this action for your own pets` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const doesRequestExist = async (req, res, next) => {
  try {
    const { incomingRequests } = req.userDoc;
    const { requestId } = req.body;
    const requestIndex = incomingRequests.findIndex(
      (incomingRequest) => incomingRequest._id.toString() === requestId
    );
    if (requestIndex !== -1) {
      req.requestIndex = requestIndex;
      next();
    } else res.status(409).send({ message: `The request was not found` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const petCanBeRequested = async (req, res, next) => {
  try {
    const { type, response } = req.body;
    const { adoptionStatus, foster } = req.petDoc;
    if (adoptionStatus === "Available") return next();
    else if (adoptionStatus === "Fostered") {
      const userIdToCheck = response
        ? req.userDoc.incomingRequests[req.requestIndex].by
        : req.userDoc._id.toString();
      if (userIdToCheck === foster) {
        if (type !== "Foster") return next();
      } else if (response)
        await Users.removeRequestsByPet(req.params.id, req.userDoc);
    } else if (response)
      await Users.removeRequestsByPet(req.params.id, req.userDoc);
    res.status(409).send({ message: `Pet was already ${adoptionStatus}` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const isPetAlreadyPendingByUser = async (req, res, next) => {
  try {
    const { adoptedPending, fosteredPending } = req.userDoc;
    const pendingForAdoptionIndex = adoptedPending.findIndex(
      (petRequested) => petRequested === req.params.id
    );
    const pendingForFosteringIndex = fosteredPending.findIndex(
      (petRequested) => petRequested === req.params.id
    );
    if (pendingForAdoptionIndex === -1 && pendingForFosteringIndex === -1)
      next();
    else
      res
        .status(409)
        .send({
          message: `You've already filed a request for this pet. Please wait for the response`,
        });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const isPetAvailable = async (req, res, next) => {
  try {
    const { adoptionStatus } = req.petDoc;
    if (adoptionStatus === "Available") next();
    else
      res.status(409).send({ message: `Only available pets can be modified` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const isPetFostered = async (req, res, next) => {
  try {
    const { adoptionStatus } = req.petDoc;
    if (adoptionStatus === "Fostered") next();
    else if (adoptionStatus === "Adopted")
      res.status(409).send({ message: `Adopted pets cannot be returned!` });
    else
      res.status(409).send({ message: `Only fostered pets can be returned` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const isPetNotAdopted = async (req, res, next) => {
  try {
    const { adoptionStatus } = req.petDoc;
    if (adoptionStatus !== "Adopted") next();
    else {
      await Users.removePetFromSaved(req.params.id, req.userDoc);
      res.status(409).send({ message: `Adopted pets cannot be saved` });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const isPetAlreadyInUserCollection = async (req, res, next) => {
  try {
    const saveOrLove = req.path.slice(-4);
    const { savedPets, lovedPets } = req.userDoc;
    const petCollection =
      saveOrLove.toLowerCase() === "save" || saveOrLove.toLowerCase() === "uest"
        ? savedPets
        : lovedPets;

    req.saveOrLove =
      saveOrLove.toLowerCase() === "save" || saveOrLove.toLowerCase() === "uest"
        ? "savedPets"
        : "lovedPets";
    const collectionPetIndex = petCollection.findIndex(
      (collectionPet) => collectionPet === req.params.id
    );
    if (req.method === "POST") {
      if (collectionPetIndex === -1) {
        if (saveOrLove.toLowerCase() === "uest") {
          // save requested pet
          req.userDoc[req.saveOrLove].push(req.params.id);
          req.userDoc = await Users.saveUser(req.userDoc);
        }
        next();
      } else {
        if (saveOrLove.toLowerCase() === "uest") next();
        else
          res
            .status(409)
            .send({ message: `You've already ${saveOrLove}d this pet` });
      }
    } else {
      // req.method === DELETE
      if (collectionPetIndex !== -1) {
        req.PetToRemoveFromCollectionIndex = collectionPetIndex;
        next();
      } else
        res
          .status(409)
          .send({ message: `This pet is not in your ${saveOrLove}d pets` });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

export const getCloudImgUrl = async (req, res, next) => {
  try {
    const ImgUrlRequset: any = await uploadToCloudinary(req.file.path, req.petDoc._id);
    const cloudImgUrl = ImgUrlRequset.secure_url;
    if (cloudImgUrl) {
      req.cloudImgUrl = cloudImgUrl;
      next();
    } else {
      res.status(500).send({ message: `Could not process request to upload the image` });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};