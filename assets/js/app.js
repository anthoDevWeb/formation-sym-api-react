//import important de React
import React from "react";
import ReactDOM from "react-dom";

//On apporte le CSS personnalisé
import "../css/app.css";

//Import du système de routage
import { HashRouter, Switch, Route } from "react-router-dom";

//On importe les éléments dont on a besoin pour l'App
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";

const App = () => {
  return (
    <HashRouter>
      <Navbar />

      <main className="container pt-5">
        <Switch>
          <Route path="/clients" component={CustomersPage} />
          <Route path="/factures" component={InvoicesPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </HashRouter>
  );
};

const rootElement = document.querySelector("#app");

ReactDOM.render(<App />, rootElement);
