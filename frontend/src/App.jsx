import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // Products
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Customers
  const [customers, setCustomers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Orders
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [orderQuantity, setOrderQuantity] = useState("");

  // Dashboard
  const [dashboard, setDashboard] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
  });

  const API_URL =
  "https://inventory-app-8iwo.onrender.com";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchOrders();
    fetchDashboard();
  }, []);

  const addProduct = async () => {
    if (!name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!sku.trim()) {
      alert("SKU is required");
      return;
    }

    try {
      await axios.post(`${API_URL}/products`, {
        name,
        sku,
        price: Number(price),
        quantity: Number(quantity),
      });

      setName("");
      setSku("");
      setPrice("");
      setQuantity("");

      fetchProducts();
      fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const addCustomer = async () => {
    try {
      await axios.post(`${API_URL}/customers`, {
        full_name: fullName,
        email,
        phone,
      });

      setFullName("");
      setEmail("");
      setPhone("");

      fetchCustomers();
      fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const createOrder = async () => {
    try {
      await axios.post(`${API_URL}/orders`, {
        customer_id: Number(customerId),
        items: [
          {
            product_id: Number(productId),
            quantity: Number(orderQuantity),
          },
        ],
      });

      setCustomerId("");
      setProductId("");
      setOrderQuantity("");

      fetchOrders();
      fetchProducts();
      fetchDashboard();

      alert("Order Created");
    } catch (error) {
      console.error(error);
      alert("Failed to create order");
    }
  };

  const updateProduct = async (product) => {
    const newName = prompt(
      "Enter product name",
      product.name
    );

    if (!newName) return;

    const newSku = prompt(
      "Enter SKU",
      product.sku
    );

    if (!newSku) return;

    const newPrice = prompt(
      "Enter price",
      product.price
    );

    if (!newPrice) return;

    const newQuantity = prompt(
      "Enter quantity",
      product.quantity
    );

    if (!newQuantity) return;

    try {
      await axios.put(
        `${API_URL}/products/${product.id}`,
        {
          name: newName,
          sku: newSku,
          price: Number(newPrice),
          quantity: Number(newQuantity),
        }
      );

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts();
      fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <div className="container">
    <h1>Inventory Management System</h1>

    {/* DASHBOARD */}
    <div className="dashboard">
      <div className="card">
        <h2>{dashboard.total_products}</h2>
        <p>Products</p>
      </div>

      <div className="card">
        <h2>{dashboard.total_customers}</h2>
        <p>Customers</p>
      </div>

      <div className="card">
        <h2>{dashboard.total_orders}</h2>
        <p>Orders</p>
      </div>
    </div>

    {/* PRODUCT FORM */}
    <h2>Add Product</h2>

    <div className="form">
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <button onClick={addProduct}>
        Add Product
      </button>
    </div>

    {/* PRODUCTS TABLE */}
    <h2>Products</h2>

    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>₹{product.price}</td>
            <td>{product.quantity}</td>

            <td>
              <button
                onClick={() =>
                  updateProduct(product)
                }
              >
                Edit
              </button>
            </td>

            <td>
              <button
                onClick={() =>
                  deleteProduct(product.id)
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <hr />

    {/* CUSTOMER FORM */}
    <h2>Add Customer</h2>

    <div className="form">
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) =>
          setFullName(e.target.value)
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
        }
      />

      <button onClick={addCustomer}>
        Add Customer
      </button>
    </div>

    {/* CUSTOMER TABLE */}
    <h2>Customers</h2>

    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.id}</td>
            <td>{customer.full_name}</td>
            <td>{customer.email}</td>
            <td>{customer.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <hr />

    {/* ORDER FORM */}
    <h2>Create Order</h2>

    <div className="form">
      <input
        type="number"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) =>
          setCustomerId(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Product ID"
        value={productId}
        onChange={(e) =>
          setProductId(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Quantity"
        value={orderQuantity}
        onChange={(e) =>
          setOrderQuantity(e.target.value)
        }
      />

      <button onClick={createOrder}>
        Create Order
      </button>
    </div>

    {/* ORDERS TABLE */}
    <h2>Orders</h2>

    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer ID</th>
          <th>Total Amount</th>
          <th>Created At</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer_id}</td>
            <td>₹{order.total_amount}</td>
            <td>
              {new Date(
                order.created_at
              ).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}
export default App;

