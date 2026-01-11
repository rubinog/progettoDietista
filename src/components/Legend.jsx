import React, { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';
import './Legend.css';

export const Legend = () => {
    const { categories } = useContext(CategoryContext);

    return (
        <div className="legend-container">
            {Object.values(categories).map(cat => (
                <div key={cat.id} className="legend-item">
                    <span className="dot big-dot" style={{ backgroundColor: cat.color }}></span>
                    <span className="legend-label">{cat.label}</span>
                </div>
            ))}
        </div>
    );
};
