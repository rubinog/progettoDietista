import React, { createContext, useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    // Initialize from static data, but allow future persistence
    const [categories, setCategories] = useState(CATEGORIES);

    const addCategory = (key, label, color) => {
        // Generate simple key if not provided (though manager normally provides it)
        const newKey = key || label.toUpperCase().replace(/\s+/g, '_');
        setCategories(prev => ({
            ...prev,
            [newKey]: { id: newKey.toLowerCase(), label, color }
        }));
    };

    const updateCategory = (key, newLabel, newColor) => {
        setCategories(prev => ({
            ...prev,
            [key]: { ...prev[key], label: newLabel, color: newColor }
        }));
    };

    const deleteCategory = (key) => {
        setCategories(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};
