import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
//import composant pagination
import Pagination from "../components/Pagination";
//Appel de l'API des factures
import InvoicesAPI from "../services/InvoicesAPI";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger",
};

const STATUS_LABEL = {
  PAID: "Payée",
  SENT: "Envoyée",
  CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des factures !");
    }
  };

  const handleDelete = async (id) => {
    //copie de la liste des clients
    const originalInvoices = [...invoices];

    //suppression immédiate de l'utilisateur dans la liste
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
    //action de suppresion de l'utilisateur dans la BDD
    try {
      await InvoicesAPI.delete(id);
      toast.success("La facture a bien été supprimée");
    } catch (error) {
      toast.error("Une erreur est survenue !");
      setInvoices(originalInvoices);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  //Mise au format Français de la date
  const formatDate = (str) => moment(str).format("DD/MM/YYYY");

  //Gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };
  //Gestion du changement de page
  const handlePageChange = (page) => setCurrentPage(page);
  //Nombre de factures que l'on veux par pages
  const itemsPerPage = 10;

  //Gestion de la recherche
  //filtrage des customers en fonction de la recherche
  const filteredInvoices = invoices.filter(
    (i) =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABEL[i.status].toLowerCase().includes(search.toLowerCase())
  );

  //Pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures </h1>
        <Link className="btn btn-secondary" to="/factures/new">
          Créer une facture
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
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th></th>
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/clients/" + invoice.customer.id}>
                    {invoice.customer.lastName} {invoice.customer.firstName}
                  </Link>
                </td>
                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                <td className="text-center">
                  <span
                    className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                  >
                    {STATUS_LABEL[invoice.status]}
                  </span>
                </td>
                <td className="text-center">
                  {invoice.amount.toLocaleString()} €
                </td>
                <td>
                  <Link
                    to={"/factures/" + invoice.id}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(invoice.id)}
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

      {itemsPerPage < filteredInvoices.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredInvoices.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default InvoicesPage;
