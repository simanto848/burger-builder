// BurgerSelection.jsx
import React from "react";
import Select from "react-select";

const BurgerSelection = ({ selectedBurger, handleBurgerSelect, burgers }) => (
  <Select
    value={selectedBurger}
    onChange={handleBurgerSelect}
    style={{ width: "200px", marginBottom: "20px" }}
    options={burgers.map((burger) => ({
      value: burger._id,
      label: burger.name,
    }))}
  />
);

export default BurgerSelection;
