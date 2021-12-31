export {};

const jwt = require("jsonwebtoken");
import { User, Users } from "../models/user";
import { Pets } from "../models/pet";

export const signup = async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      publishedPets: [],
      savedPets: [],
      lovedPets: [],
      adoptedPets: [],
      fosteredPets: [],
      adoptedPending: [],
      fosteredPending: [],
      incomingRequests: [],
    });

    const { _id } = await Users.saveUser(user);

    const currentUserToken: any = jwt.sign({ _id }, process.env.JWT_SECRET, {
      expiresIn: 7200,
    });

    res.send({ _id, token: currentUserToken });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const login = (req, res) => {
  try {
    const { userDoc } = req;

    const currentUserToken: any = jwt.sign(
      { _id: userDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: 7200 }
    );

    res.send({ userDoc, token: currentUserToken });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const showUsers = async (req, res) => {
  try {
    const users = await Users.getAllUsers(req.body.limit);
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const showUser = async (req, res) => {
  try {
    const user = await Users.getUserById(req.params.id, false);
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const showUserContactInfo = async (req, res) => {
  try {
    const publisher = await Users.getUserById(req.params.id, true);
    res.send(publisher);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const showUserWithPets = async (req, res) => {
  try {
    const { searchedUserDoc } = req;
    const userPets = await Pets.getPetsByUser(
      req.params.id,
      searchedUserDoc.savedPets,
      req.body.limit
    );

    res.send({ user: searchedUserDoc, userPets });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const editUser = async (req, res) => {
  try {
    const editedUser = await Users.editUser(req.params.id, req.body);

    res.send(editedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const banToggleUser = async (req, res) => {
  try {
    const { searchedUserDoc } = req;
    if (!searchedUserDoc.banned) searchedUserDoc.banned = true;
    else searchedUserDoc.banned = false;
    const bannedUser = await Users.saveUser(searchedUserDoc);

    res.send(bannedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const logout = (req, res) => {
  try {
    const { fullName } = req.userDoc;

    res.send({
      title: `Goodbye, ${fullName}!`,
      text: `See you next time!`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
