import React from "react";
import axios from "axios";
import { USERS_API } from "../config";

//Création d'un utilisateur
function create(user) {
  return axios.post(USERS_API, user);
}

export default { create };
