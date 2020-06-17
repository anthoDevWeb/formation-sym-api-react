import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

//Déconnexion (suppresion du token du localStorage et suppression du header token dans axios)
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];
}

/**
 *Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {Object} credentials
 */
function authenticate(credentials) {
  return axios
    .post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      window.localStorage.setItem("authToken", token);

      setAxiosToken(token);

      return true;
    });
}

/**
 *  Positionne le token JWT sur axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  //Vérifie que nous avons un token
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    //vérifie la date d'xpiration du token
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est connecté ou non
 * @returns boolean
 */
function isAuthenticated() {
  const token = window.localStorage.getItem("authToken");

  if (token) {
    const { exp: expiration } = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }

  return false;
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated,
};
