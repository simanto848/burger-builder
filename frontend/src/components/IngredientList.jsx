// IngredientList.jsx
import React from "react";

const IngredientList = ({ selectedIngredients, handleIngredientRemove }) => (
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
);

export default IngredientList;
