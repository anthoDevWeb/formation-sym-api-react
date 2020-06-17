import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import axios from "axios";
import UserAPI from "../services/UserAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  //Gestion de la soumission d'un utilisateur
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await UserAPI.create(user);
      setErrors({});
      toast.success(
        "Vous êtes désormais inscrit, vous pouvez vous connecter ! 👍"
      );
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach((violation) => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
      toast.error("Des erreurs dans votre formulaire ! 😕");
    }
  };
  return (
    <>
      <h1>Page d'inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Saisissez votre nom de famille"
          value={user.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Saisissez votre prénom"
          value={user.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="Saisissez votre Mail"
          value={user.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          placeholder="Saisissez votre mot de passe"
          value={user.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation du mot de passe"
          type="password"
          placeholder="Confirmez votre mot de passe"
          value={user.passwordConfirm}
          onChange={handleChange}
          error={errors.passwordConfirm}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            S'inscrire
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
