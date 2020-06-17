import React, { useState, useContext } from "react";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

const LoginPage = ({ history }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { setIsAuthenticated } = useContext(AuthContext);

  const [error, setError] = useState("");

  //Gestion des champs de connexion
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  //Gestion du submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.success("Vous êtes désormais connecté !");
      history.replace("/clients");
    } catch (error) {
      console.log(error.response);
      //Message d'erreur afficher en cas d'erreur de connexion
      setError(
        "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas"
      );
      toast.error("Une erreur est survenue !");
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          label="Adresse Email"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Adresse email de connexion"
          type="email"
          error={error}
        />
        <Field
          name="password"
          label="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          type="password"
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
