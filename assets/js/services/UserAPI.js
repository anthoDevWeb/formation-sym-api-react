import React from "react";
import axios from "axios";

//Création d'un utilisateur
function create(user) {
  return axios.post("http://localhost:8000/api/users", user);
}

export default { create };
