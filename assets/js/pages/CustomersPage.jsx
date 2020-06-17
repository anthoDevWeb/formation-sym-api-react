import React, { useEffect, useState } from "react";
//import composant pagination
import Pagination from "../components/Pagination";
//Appel des éléments de l'API
import CustomersAPI from "../services/CustomersAPI";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

//Récupération des clients dans la BDD via l'API
const CustomerPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //Recupère les customers dans la BDD
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger les clients !");
    }
  };
  // Au chargement du composant on va chercher les composants
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Function de suppression des customers
  const handleDelete = async (id) => {
    //copie de la liste des clients
    const originalCustomers = [...customers];

    //suppression immédiate de l'utilisateur dans la liste
    setCustomers(customers.filter((customer) => customer.id !== id));
    //action de suppresion de l'utilisateur dans la BDD
    try {
      await CustomersAPI.delete(id);
      toast.success("Le client a bien été supprimé ");
    } catch (error) {
      setCustomers(originalCustomers);
      toast.error("La suppression du client n'a pas réussie");
    }
  };

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  //Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);
  //Nombre de clients que l'on veux par pages
  const itemsPerPage = 10;
  //filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  //Pagination des données
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des clients</h1>
        <Link to="/clients/new" className="btn btn-secondary">
          Créer un client
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="Rechercher..."
        />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>

        {!loading && (
          <tbody>
            {paginatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={"/clients/" + customer.id}>
                    {customer.lastName} {customer.firstName}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                  <span className="badge badge-secondary">
                    {customer.invoices.length}
                  </span>
                </td>
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} €
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}

      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomerPage;
