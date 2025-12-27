import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/cart/${user.id}`)
      .then(res => setCart(res.data))
      .catch(err => console.error(err));
  }, []);

  const remove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      setCart(prev => prev.filter(item => item.id !== id));
    } catch {
      alert("Failed to remove");
    }
  };

  // ✅ BUY SINGLE COURSE
  const buyOne = (item) => {
    localStorage.setItem("singleCheckout", JSON.stringify(item));
    navigate("/checkout");
  };

  return (
    <div>
      <Header />

      <div className="cart-container">
        <h2 className="cart-title">My Cart</h2>

        {cart.length === 0 ? (
          <p className="cart-empty">Your cart is empty 🛒</p>
        ) : (
          cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.thumbnail} alt={item.title} className="cart-thumb" />

              <div className="cart-info">
                <div className="cart-title-text">{item.title}</div>
                <div className="cart-type">{item.courseType} course</div>
                <p><strong>₹{item.price}</strong></p>
              </div>

              <div className="cart-actions">
                {/* ✅ BUY ONE */}
                <button
                  className="buy-one-btn"
                  onClick={() => buyOne(item)}
                >
                  Buy Now
                </button>

                <button
                  className="remove-btn"
                  onClick={() => remove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <div className="cart-footer">
            <button
              className="buy-btn"
              onClick={() => {
                localStorage.removeItem("singleCheckout");
                navigate("/checkout");
              }}
            >
              Buy All
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
