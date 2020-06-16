//import important de React
import React, { useState } from "react";
import ReactDOM from "react-dom";
//Import du système de routage
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
//On apporte le CSS personnalisé
import "../css/app.css";
//On importe les éléments dont on a besoin pour l'App
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
//import d'un context d'authentification
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";

AuthAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const NavbarWithRouter = withRouter(Navbar);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      <HashRouter>
        <NavbarWithRouter />

        <main className="container pt-5">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/inscription" component={RegisterPage} />
            <PrivateRoute path="/clients/:id" component={CustomerPage} />
            <PrivateRoute path="/clients" component={CustomersPage} />
            <PrivateRoute path="/factures/:id" component={InvoicePage} />
            <PrivateRoute path="/factures" component={InvoicesPage} />
            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");

ReactDOM.render(<App />, rootElement);
