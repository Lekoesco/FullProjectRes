import React, { useEffect, useState } from "react";
import api from "../services/api";

const restaurantImages = {
  "Taverna Nikos": "/images/taverna.jpg",
  "Souvlaki House": "/images/souvlaki.jpg",
  "Fish & Grill": "/images/fish.jpg",
  "Meat Point": "/images/meat.jpg",
  "Veggie Garden": "/images/veggie.jpg",
  "Pizza Roma": "/images/pizza.jpg",
  "Kebab King": "/images/kebab.png",
  "Sushi Zen": "/images/sushi.jpg",
  "Burger Lab": "/images/burger.jpg",
  "Bakery Bliss": "/images/bakery.jpg",
};

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [popupRestaurant, setPopupRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data.restaurants);
      } catch (err) {
        alert("❌ Σφάλμα φόρτωσης εστιατορίων");
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>🍽️ Εστιατόρια</h2>
      <div className="grid">
        {restaurants.map((r) => (
          <div key={r.restaurant_id} className="card">
            <img
              src={restaurantImages[r.name] || "https://via.placeholder.com/400x300?text=Restaurant"}
              alt={r.name}
              onClick={() => setPopupRestaurant(r)}
              style={{ cursor: "pointer" }}
            />
            <div className="card-body">
              <h3>{r.name}</h3>
              <p>📍 {r.location}</p>
            </div>
          </div>
        ))}
      </div>

      {popupRestaurant && (
        <div className="popup" onClick={() => setPopupRestaurant(null)} style={popupStyles.backdrop}>
          <div style={popupStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{popupRestaurant.name}</h3>
            <p>🕒 Ωράριο λειτουργίας: <strong>{popupRestaurant.opening_hours}</strong></p>
            <button onClick={() => setPopupRestaurant(null)}>Κλείσιμο</button>
          </div>
        </div>
      )}
    </div>
  );
};

const popupStyles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    background: "white",
    padding: "2rem",
    borderRadius: "8px",
    textAlign: "center",
    minWidth: "300px",
  },
};

export default RestaurantsPage;
