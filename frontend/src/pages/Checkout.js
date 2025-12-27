import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadItems = async () => {
      try {
        const storedSingle = localStorage.getItem("singleCheckout");
        const singleItem = storedSingle
          ? JSON.parse(storedSingle)
          : null;

        // ✅ BUY NOW FLOW
        if (singleItem) {
          setItems([
            {
              ...singleItem,
              thumbnail:
                singleItem.thumbnail ||
                singleItem.image ||
                "/default-course.png"
            }
          ]);
        }
        // ✅ CART FLOW
        else {
          const res = await axios.get(
            `http://localhost:5000/api/cart/${user.id}`
          );

          setItems(
            res.data.map((item) => ({
              ...item,
              thumbnail:
                item.thumbnail || item.image || "/default-course.png"
            }))
          );
        }
      } catch (err) {
        console.error("Checkout load error:", err);
      }
    };

    loadItems();
  }, [user?.id]); // ✅ ONLY STABLE DEPENDENCY

  const total = items.reduce(
    (sum, c) => sum + Number(c.price || 0),
    0
  );

  const handlePayment = async () => {
    try {
      const orderRes = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {
          amount: total,
          studentId: user.id
        }
      );

      const options = {
        key: "rzp_test_xxxxx",
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Sales Academy",
        description: "Course Purchase",
        order_id: orderRes.data.id,

        handler: async function (response) {
          await axios.post(
            "http://localhost:5000/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              studentId: user.id
            }
          );

          localStorage.removeItem("singleCheckout");
          alert("Payment Successful 🎉");
          navigate("/studenthomescreen");
        }
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <>
      <Header />

      <div className="checkout-container">
        <h2>💳 Checkout</h2>

        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div className="checkout-list">
              {items.map((item) => (
                <div key={item.id} className="checkout-card">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    onError={(e) =>
                      (e.target.src = "/default-course.png")
                    }
                  />
                  <div>
                    <h4>{item.title}</h4>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3>Total: ₹{total}</h3>

            <button className="pay-btn" onClick={handlePayment}>
              Pay Now
            </button>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
