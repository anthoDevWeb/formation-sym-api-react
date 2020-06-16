import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import axios from "axios";
import InvoicesAPI from "../services/InvoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });
  //récupération de la liste des clients
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      history.replace("/factures");
      //TODO : Flash notification échec
      console.log(error.response);
    }
  };
  //Récupération d'une facture
  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await InvoicesAPI.find(id);
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      console.log(error.response);
      //TOD : Flash notification echec
      history.replace("/factures");
    }
  };
  //Récupération de la liste des clients pour une nouvelle facture
  useEffect(() => {
    fetchCustomers();
  }, []);
  //Récupération de la facture pour la modification
  useEffect(() => {
    if (id !== "new") {
      fetchInvoice(id);
      setEditing(true);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  //Gestion de la soumission des factures
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await InvoicesAPI.update(id, invoice);

        //TODO : Flash notification de succès
      } else {
        await InvoicesAPI.create(invoice);
        //TODO : Flash de notification de succès
        history.replace("/factures");
      }
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });

        setErrors(apiErrors);

        //TODO : Flash notification d'erreurs
      }
    }
  };

  return (
    <>
      {(editing && <h1>Edition d'une facture</h1>) || (
        <h1>Création d'une facture</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />

        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="Status"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/factures" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
