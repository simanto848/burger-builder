// CheckoutModal.jsx
import React from "react";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";

const CheckoutModal = ({
  selectedIngredients,
  handleCheckout,
  setModalOpen,
}) => (
  <Modal>
    <ModalBody>
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
);

export default CheckoutModal;
