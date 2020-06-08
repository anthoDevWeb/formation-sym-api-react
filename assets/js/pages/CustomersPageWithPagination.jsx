import React, { useEffect, useState } from "react";

import axios from "axios";
//import composant pagination
import Pagination from "../components/Pagination";

//Récupération des clients dans la BDD via l'API
const CustomerPageWithPagination = (props) => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  //Nombre de clients que l'on veux par pages
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then((response) => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch((error) => console.log(error.response));
  }, [currentPage]);

  // Function de suppression des clients
  const handleDelete = (id) => {
    //copie de la liste des clients
    const originalCustomers = [...customers];

    //suppression immédiate de l'utilisateur dans la liste
    setCustomers(customers.filter((customer) => customer.id !== id));

    //action de suppresion de l'utilisateur dans la BDD
    axios
      .delete("http://localhost:8000/api/customers/" + id)
      .then((response) => console.log("ok"))
      .cath((error) => {
        setCustomers(originalCustomers);
        console.log(error.response);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
  };

  const paginatedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des clients (pagination)</h1>

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

        <tbody>
          {/* Permet d'avoir un écran de chargement quand le tableau est vide*/}
          {loading && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {!loading &&
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.lastName} {customer.firstName}
                  </a>
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
      </table>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default CustomerPageWithPagination;
