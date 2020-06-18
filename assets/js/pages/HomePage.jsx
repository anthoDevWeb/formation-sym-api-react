import React from "react";

const HomePage = (props) => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">Gestion des factures !</h1>
      <p className="lead">
        CRM permettant de gérer les factures, les clients et leurs via un CRM
        intéractif et simple d'utilisation.
      </p>
      <hr className="my-4" />
      <p>
        N'hésitez pas lancez-vous dans la gestion des factures de vos clients en
        toute simplicité.👍
      </p>
      <p className="lead">
        <a className="btn btn-primary btn-lg" href="#" role="button">
          Learn more
        </a>
      </p>
    </div>
  );
};

export default HomePage;
