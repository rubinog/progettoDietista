import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryContext } from './CategoryContextObject';

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState(CATEGORIES);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (!response.ok) {
                    throw new Error('Unable to load categories');
                }
                const data = await response.json();
                if (data?.categories) {
                    setCategories(data.categories);
                }
            } catch {
                setCategories(CATEGORIES);
            }
        };

        loadCategories();
    }, []);

    const sanitizeKey = (value) => String(value || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');

    const addCategory = (key, label, color) => {
        const newKey = sanitizeKey(key || label);

        if (!newKey || !label?.trim() || !color?.trim()) {
            return;
        }

        fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: newKey, label: label.trim(), color: color.trim() }),
        })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(data => {
                if (data?.categories) {
                    setCategories(data.categories);
                }
            })
            .catch(() => null);
    };

    const updateCategory = (key, newLabel, newColor) => {
        const normalizedKey = sanitizeKey(key);

        if (!normalizedKey || !newLabel?.trim() || !newColor?.trim()) {
            return;
        }

        fetch(`/api/categories/${encodeURIComponent(normalizedKey)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label: newLabel.trim(), color: newColor.trim() }),
        })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(data => {
                if (data?.categories) {
                    setCategories(data.categories);
                }
            })
            .catch(() => null);
    };

    const deleteCategory = (key) => {
        const normalizedKey = sanitizeKey(key);

        if (!normalizedKey) {
            return;
        }

        fetch(`/api/categories/${encodeURIComponent(normalizedKey)}`, {
            method: 'DELETE',
        })
            .then(response => response.ok ? response.json() : Promise.reject())
            .then(data => {
                if (data?.categories) {
                    setCategories(data.categories);
                }
            })
            .catch(() => null);
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};
