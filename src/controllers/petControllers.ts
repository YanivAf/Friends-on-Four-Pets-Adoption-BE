export {};

import { Pet, Pets } from "../models/pet";
import { Users } from "../models/user";

export const showPets = async (req, res) => {
  try {
    const { properties, limit } = req.body;
    const pets = await Pets.getPetsByProperties(properties, limit);
    res.send(pets);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const showUserPets = async (req, res) => {
  try {
    const { searchedUserDoc, userDoc } = req;
    if (searchedUserDoc._id.toString() === userDoc._id.toString()) {
      searchedUserDoc.recentlyApproved = 0;
      await Users.saveUser(searchedUserDoc);
    }
    const userPets = await Pets.getPetsByUser(
      req.params.id,
      searchedUserDoc.savedPets,
      req.body.limit
    );
    res.send(userPets);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const showPet = (req, res) => {
  try {
    res.send({ pet: req.petDoc });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const addToPetsCollection = async (req, res) => {
  try {
    const { petDoc, userDoc, saveOrLove } = req;

    userDoc[saveOrLove].push(req.params.id);
    const currentUser = await Users.saveUser(userDoc);

    let lovedPet = petDoc;
    if (saveOrLove === "lovedPets") {
      petDoc.loves++;
      lovedPet = await Pets.savePet(petDoc);
    }

    res.send({ [saveOrLove]: userDoc[saveOrLove], loves: lovedPet.loves });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const removeFromPetsCollection = async (req, res) => {
  try {
    const { petDoc, userDoc, saveOrLove, PetToRemoveFromCollectionIndex } = req;

    userDoc[saveOrLove].splice(PetToRemoveFromCollectionIndex, 1);
    const currentUser = await Users.saveUser(userDoc);

    let unlovedPet = petDoc;
    if (saveOrLove === "lovedPets") {
      petDoc.loves--;
      unlovedPet = await Pets.savePet(petDoc);
    }

    res.send({ [saveOrLove]: userDoc[saveOrLove], loves: unlovedPet.loves });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const addPet = async (req, res) => {
  try {
    const { height, weight, hypoallergenic } = req;

    const pet = new Pet({
      ...req.body,
      ...(req.body.height !== undefined ? height : { height: 0 }),
      ...(req.body.weight !== undefined ? weight : { weight: 0 }),
      ...(req.body.hypoallergenic !== undefined && hypoallergenic),
      adoptionStatus: "Available",
      loves: 0,
      petPicture: "https://cutewallpaper.org/25/animal-footprints-wallpaper/100-free-paw-print-amp-paw-images.png",
      publisher: req.userDoc._id,
      adopter: null,
      foster: null,
    });

    const newPet = await Pets.savePet(pet);

    const { userDoc } = req;
    userDoc.publishedPets.push(pet._id.toString());
    await Users.saveUser(userDoc);

    res.send(newPet);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const editPet = async (req, res) => {
  try {
    const { height, weight, hypoallergenic } = req;
    const petPicture = req.cloudImgUrl ? req.cloudImgUrl : req.petDoc.petPicture;
    const updatedData = {
      ...req.body,
      ...(req.body.height !== undefined && height),
      ...(req.body.weight !== undefined && weight),
      ...(req.body.hypoallergenic !== undefined && hypoallergenic),
      petPicture,
    };
    const editedPet = await Pets.editPet(req.petDoc._id, updatedData);

    res.send(editedPet);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const sendRequest = async (req, res) => {
  try {
    const { type } = req.body;
    if (type !== "Adopt" && type !== "Foster")
      throw new Error("The request type is invalid");
    const { userDoc, petDoc } = req;

    if (type === "Adopt") userDoc.adoptedPending.push(petDoc._id);
    else userDoc.fosteredPending.push(petDoc._id);
    const currentUser = await Users.saveUser(userDoc);

    const petPublisher = await Users.getUserById(petDoc.publisher, false);
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
    const petPublisherUser = await Users.saveUser(petPublisher);

    res.send(currentUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const sendResponse = async (req, res) => {
  try {
    const { response } = req.body;
    const { userDoc, petDoc, requestIndex } = req;
    const request = userDoc.incomingRequests[requestIndex];

    const petRequester = await Users.getUserById(request.by, false);
    const relevantPets =
      request.type === "Adopt" ? "adoptedPets" : "fosteredPets";
    const relevantPending =
      request.type === "Adopt" ? "adoptedPending" : "fosteredPending";
    const relevantRequster = request.type === "Adopt" ? "adopter" : "foster";
    const updatedPending = petRequester[relevantPending].filter(
      (pending) => pending !== petDoc._id.toString()
    );
    const updatedSaved = petRequester.savedPets.filter(
      (saved) => saved !== petDoc._id.toString()
    );
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

    const { phone, email, fullName } = await Users.saveUser(petRequester);
    const { petName, adoptionStatus } = await Pets.savePet(petDoc);
    const currentUser = await Users.saveUser(userDoc);

    res.send({
      petDetails: { petName, adoptionStatus },
      requesterContactDetails: { phone, email, fullName },
      response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const returnPet = async (req, res) => {
  try {
    const { userDoc, petDoc, fosterUserDoc } = req;

    const affectedUser = fosterUserDoc ? fosterUserDoc : userDoc;
    const updatedFosteredPets = affectedUser.fosteredPets.filter(
      (pet) => pet.toString() !== petDoc._id.toString()
    );
    affectedUser.fosteredPets = updatedFosteredPets;
    petDoc.foster = null;
    petDoc.adoptionStatus = "Available";

    await Pets.savePet(petDoc);
    const currentUser = await Users.saveUser(affectedUser);

    res.send(currentUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const deletePet = async (req, res) => {
  try {
    const { petDoc } = req;
    const deleteOperation = await Pets.deletePetById(petDoc._id);
    res.send({ pet: req.petDoc, deleted: deleteOperation.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
