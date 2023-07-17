import React from "react";
import ReactDOM from "react-dom";
import {useState} from 'react'
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm
} from "react-crud-table";

// Component's Base CSS
import "./index.css";
import axios from "axios";



const BASE_URL = "http://localhost/api/product";

const DescriptionRenderer = ({ field }) => <textarea {...field} />;

const Example = () => {
  const [apiUrl, setApiUrl] = useState(BASE_URL);
  
  const HTTP_CLIENT = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: apiUrl
  });

  let products = [];
  HTTP_CLIENT.get().then((response) => {
    products = response.data;
  });

  const SORTERS = {
    NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
    NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
    STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
    STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a))
  };

  const getSorter = data => {
    const mapper = x => x[data.field];
    let sorter = SORTERS.STRING_ASCENDING(mapper);

    if (data.field === "id") {
      sorter =
        data.direction === "ascending"
          ? SORTERS.NUMBER_ASCENDING(mapper)
          : SORTERS.NUMBER_DESCENDING(mapper);
    } else {
      sorter =
        data.direction === "ascending"
          ? SORTERS.STRING_ASCENDING(mapper)
          : SORTERS.STRING_DESCENDING(mapper);
    }

    return sorter;
  };

  let count = products.length;
  const service = {
    fetchItems: payload => {
      let result = Array.from(products);
      result = result.sort(getSorter(payload.sort));
      console.log(result);
      return Promise.resolve(result);
    },
    create: product => {
      const newProduct = {
        ...product
      };
      return HTTP_CLIENT.post(`${apiUrl}?name=${encodeURIComponent(newProduct.name)}`)
        .then((response) => {
          products.push(response.data);
          return Promise.resolve(response.data);
        })
        .catch(error => {
          // Handle error if needed
          console.error('Error creating product:', error);
          return Promise.reject(error);
        });
    },
    update: data => {
      const product = products.find(t => t.id === data.id);
      product.name = data.name;

      return HTTP_CLIENT.put(`${apiUrl}/${product.id}?name=${encodeURIComponent(product.name)}`)
        .then(() => {
          return Promise.resolve(product);
        })
        .catch(error => {
          // Handle error if needed
          console.error('Error updating product:', error);
          return Promise.reject(error);
        });
    },
    delete: data => {
      const product = products.find(t => t.id === data.id);
      product.name = data.name;

      return HTTP_CLIENT.delete(`${apiUrl}/${product.id}`)
        .then(() => {
          products = products.filter(t => t.id !== product.id);
          return Promise.resolve();
        })
        .catch(error => {
          // Handle error if needed
          console.error('Error deleting product:', error);
          return Promise.reject(error);
        });
    }
  };

  const styles = {
    container: { margin: "auto", width: "fit-content" }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
      />

      <CRUDTable
        caption="products"
        fetchItems={payload => service.fetchItems(payload)}
        key="id"
      >
        <Fields>
          <Field name="id" label="Id" hideInCreateForm />
          <Field name="name" label="Name" placeholder="Name" />
          {/* <Field
            name="description"
            label="Description"
            render={DescriptionRenderer}
          /> */}
        </Fields>
        <CreateForm
          name="Product Creation"
          message="Create a new product!"
          trigger="Create product"
          onSubmit={product => service.create(product)}
          submitText="Create"
          validate={values => {
            const errors = {};
            if (!values.name) {
              errors.name = "Please, provide product's name";
            }

            // if (!values.description) {
            //   errors.description = "Please, provide product's description";
            // }

            return errors;
          }}
        />

        <UpdateForm
          name="product Update Process"
          message="Update product"
          trigger="Update"
          onSubmit={product => service.update(product)}
          submitText="Update"
          validate={values => {
            const errors = {};

            if (!values.id) {
              errors.id = "Please, provide id";
            }

            if (!values.name) {
              errors.name = "Please, provide product's name";
            }

            // if (!values.description) {
            //   errors.description = "Please, provide product's description";
            // }

            return errors;
          }}
        />

        <DeleteForm
          name="product Delete Process"
          message="Are you sure you want to delete the product?"
          trigger="Delete"
          onSubmit={product => service.delete(product)}
          submitText="Delete"
          validate={values => {
            const errors = {};
            if (!values.id) {
              errors.id = "Please, provide id";
            }
            return errors;
          }}
        />
      </CRUDTable>
    </div>
  );
};

Example.propTypes = {};

ReactDOM.render(<Example />, document.getElementById("root"));