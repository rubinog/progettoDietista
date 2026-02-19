import React, { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContextObject';
import './FoodItem.css';

export const FoodItem = ({ item }) => {
    // item: { text: "Latte 200ml", category: "LATTE" }
    const { categories } = useContext(CategoryContext);
    const categoryParams = categories[item.category];

    // Fallback if category deleted or missing
    const color = categoryParams ? categoryParams.color : '#ccc';

    return (
        <div className="food-item">
            <span className="dot" style={{ backgroundColor: color }}></span>
            <span className="food-text">
                {item.text}
                {item.quantity && <span className="food-quantity"> {item.quantity}</span>}
            </span>
        </div>
    );
};
