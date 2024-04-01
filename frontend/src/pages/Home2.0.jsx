import { useEffect, useState } from "react";
import topImg from "../assets/images/top.png";
import bottomImg from "../assets/images/bottom.png";
import saladImg from "../assets/images/salad.png";
import cheeseImg from "../assets/images/cheese.png";
import fishImg from "../assets/images/fish.png";
import beefImg from "../assets/images/beef.png";
import chickenImg from "../assets/images/chicken.png";
import toast, { Toaster } from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import "./Home.css";

export default function Home() {
  const [burgers, setBurgers] = useState([]);
  const [selectedBurger, setSelectedBurger] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const navigate = useNavigate();

  const ingredients = [
    { name: "salad", price: 20, img: saladImg, quantity: 0 },
    { name: "cheese", price: 30, img: cheeseImg, quantity: 0 },
    { name: "chicken", price: 50, img: chickenImg, quantity: 0 },
    { name: "fish", price: 100, img: fishImg, quantity: 0 },
    { name: "beef", price: 80, img: beefImg, quantity: 0 },
  ];

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          setBurgers(data);
        }
      } catch (error) {
        toast.error("Failed to fetch burgers!");
      }
    };
    fetchBurgers();
  }, []);

  useEffect(() => {
    const selectedBurgerId = localStorage.getItem("selectedBurger");
    const selectedIngredientsString = localStorage.getItem(
      "selectedIngredients"
    );
    const storedTotalAmount = localStorage.getItem("totalAmount");

    if (selectedBurgerId) {
      setSelectedBurger(selectedBurgerId);
    }

    if (selectedIngredientsString) {
      try {
        const selectedIngredients = JSON.parse(selectedIngredientsString);
        setSelectedIngredients(selectedIngredients);
        const totalPrice = selectedIngredients.reduce(
          (acc, curr) => acc + curr.price,
          0
        );
        setTotalAmount(parseFloat(storedTotalAmount) || totalPrice);
      } catch (error) {
        console.error("Error parsing selected ingredients:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedBurger", selectedBurger);
    localStorage.setItem(
      "selectedIngredients",
      JSON.stringify(selectedIngredients)
    );
    localStorage.setItem("totalAmount", totalAmount);
  }, [selectedBurger, selectedIngredients, totalAmount]);

  const orderNow = () => {
    setModalOpen(true);
  };

  const handleIngredientSelect = (ingredientName) => {
    if (selectedBurger) {
      const selectedIngredient = ingredients.find(
        (ingredient) => ingredient.name === ingredientName
      );
      setSelectedIngredients([...selectedIngredients, selectedIngredient]);
      setTotalAmount(
        (prevTotalAmount) => prevTotalAmount + selectedIngredient.price
      );
    }
  };

  const handleIngredientRemove = (ingredient) => {
    if (selectedBurger) {
      const updatedIngredients = selectedIngredients.filter(
        (item) => item.name !== ingredient.name
      );
      setSelectedIngredients(updatedIngredients);
      setTotalAmount((prevTotalAmount) => prevTotalAmount - ingredient.price);
    }
  };

  const handleBurgerSelect = (value) => {
    setSelectedBurger(value);
    const selected = burgers.find((burger) => burger._id === value);
    if (selected) {
      setTotalAmount(selected.price);
    } else {
      setTotalAmount(0);
      toast.error("Please select a burger to proceed!");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { totalAmount, selectedIngredients } });
    setTotalAmount(0);
    setSelectedIngredients([]);
    setModalOpen(false);
  };

  return (
    <div className="home-container">
      <Toaster />
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader
          toggle={() => setModalOpen(false)}
          style={{ backgroundColor: "#d6770f" }}
        >
          Your Order Summary
        </ModalHeader>
        <ModalBody>
          <h5>Total Price: {totalAmount} BDT</h5>
          <h6>Selected Ingredients:</h6>
          <ul>
            {selectedIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient.name}</li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "#d6770f" }}>
          <Button color="success" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>{" "}
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <div className="burger-section">
        <Select
          value={selectedBurger}
          onChange={handleBurgerSelect}
          style={{ width: "200px", marginBottom: "20px" }}
          options={burgers.map((burger) => ({
            value: burger._id,
            label: burger.name,
          }))}
        />
        <img src={topImg} alt="Top Bun" style={{ height: "100px" }} />
        <div className="burger-ingredients">
          {selectedIngredients.map((ingredient, index) => (
            <img
              key={index}
              src={ingredient.img}
              alt={ingredient.name}
              className="ingredient-image"
              onClick={() => handleIngredientRemove(ingredient)}
            />
          ))}
        </div>
        {selectedIngredients.length === 0 && <h4>Please add ingredients</h4>}
        <img
          src={bottomImg}
          alt="Bottom Bun"
          style={{ height: "50px", width: "290px" }}
        />
      </div>
      <div className="ingredients-section">
        <h2>Add Ingredients</h2>
        {ingredients.map((ingredient) => (
          <div key={ingredient.name} className="ingredient">
            <p>{ingredient.name}</p>
            <Button
              color="success"
              onClick={() => handleIngredientSelect(ingredient.name)}
              disabled={!selectedBurger}
            >
              Add
            </Button>
            <Button
              color="danger"
              onClick={() => handleIngredientRemove(ingredient)}
              disabled={!selectedBurger}
            >
              Less
            </Button>
          </div>
        ))}
        <p>Price: {totalAmount} BDT</p>
        <Button color="success" onClick={orderNow} disabled={!selectedBurger}>
          Order Now
        </Button>
      </div>
    </div>
  );
}
