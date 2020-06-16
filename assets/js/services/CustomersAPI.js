import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost:8000/api/customers")
    .then((response) => response.data["hydra:member"]);
}

function deleteCustomer(id) {
  axios.delete("http://localhost:8000/api/customers/" + id);
}

function find(id) {
  return axios
    .get("http://localhost:8000/api/clients/" + id)
    .then((response) => response.data);
}

function update(id, customer) {
  axios.put("http://localhost:8000/api/customers/" + id, customer);
}

function create(customer) {
  axios.post("http://localhost:8000/api/customers", customer);
}

export default {
  findAll,
  delete: deleteCustomer,
  find,
  update,
  create,
};
