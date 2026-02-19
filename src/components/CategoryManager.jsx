import React, { useState, useContext } from 'react';
import { X, Trash2, Save, Plus } from 'lucide-react';
import { CategoryContext } from '../context/CategoryContextObject';
import './CategoryManager.css';

export const CategoryManager = ({ isOpen, onClose }) => {
    const { categories, addCategory, updateCategory, deleteCategory } = useContext(CategoryContext);

    // Local state for the "Add New" form
    const [newLabel, setNewLabel] = useState('');
    const [newColor, setNewColor] = useState('#000000');

    // Local state for editing an existing category inline
    // null or { key: 'KEY', label: '...', color: '...' }
    const [editingKey, setEditingKey] = useState(null);
    const [editLabel, setEditLabel] = useState('');
    const [editColor, setEditColor] = useState('');

    if (!isOpen) return null;

    const handleAddNew = () => {
        if (!newLabel.trim()) return;
        addCategory(null, newLabel, newColor);
        setNewLabel('');
        setNewColor('#000000');
    };

    const startEditing = (key, cat) => {
        setEditingKey(key);
        setEditLabel(cat.label);
        setEditColor(cat.color);
    };

    const saveEditing = () => {
        if (editingKey) {
            updateCategory(editingKey, editLabel, editColor);
            setEditingKey(null);
        }
    };

    const cancelEditing = () => {
        setEditingKey(null);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content category-manager-content">
                <header className="modal-header">
                    <h3>Gestione Categorie</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </header>

                <div className="modal-body">

                    {/* List of Existing Categories */}
                    <div className="categories-list">
                        <h4>Categorie Esistenti</h4>
                        <ul>
                            {Object.entries(categories).map(([key, cat]) => (
                                <li key={key} className="category-row">
                                    {editingKey === key ? (
                                        <>
                                            <input
                                                type="color"
                                                value={editColor}
                                                onChange={e => setEditColor(e.target.value)}
                                                className="color-picker-input"
                                            />
                                            <input
                                                type="text"
                                                value={editLabel}
                                                onChange={e => setEditLabel(e.target.value)}
                                                className="text-input"
                                            />
                                            <div className="action-buttons">
                                                <button className="save-icon-btn" onClick={saveEditing}><Save size={16} /></button>
                                                <button className="cancel-icon-btn" onClick={cancelEditing}><X size={16} /></button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className="color-preview"
                                                style={{ backgroundColor: cat.color }}
                                                onClick={() => startEditing(key, cat)}
                                                title="Clicca per modificare"
                                            />
                                            <span
                                                className="category-label"
                                                onClick={() => startEditing(key, cat)}
                                            >
                                                {cat.label}
                                            </span>
                                            <button className="delete-btn" onClick={() => deleteCategory(key)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Add New Form */}
                    <div className="add-category-section">
                        <h4>Nuova Categoria</h4>
                        <div className="form-row">
                            <input
                                type="color"
                                value={newColor}
                                onChange={e => setNewColor(e.target.value)}
                                className="color-picker-input"
                            />
                            <input
                                type="text"
                                placeholder="Nome categoria..."
                                value={newLabel}
                                onChange={e => setNewLabel(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddNew()}
                            />
                            <button className="add-btn" onClick={handleAddNew}>
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
