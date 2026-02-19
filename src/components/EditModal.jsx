import React, { useState, useContext } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { CategoryContext } from '../context/CategoryContextObject';
import './EditModal.css';

export const EditModal = ({ isOpen, onClose, mealIndex, dayIndex, mealType, initialData, onSave }) => {
    const { categories } = useContext(CategoryContext);
    const [items, setItems] = useState(() => [...(initialData?.items || [])]);
    const [note, setNote] = useState(() => initialData?.note || '');
    const [copyTargetDay, setCopyTargetDay] = useState('');
    const [copyNoteToTarget, setCopyNoteToTarget] = useState(false);
    const [newItemText, setNewItemText] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('CEREALI');

    const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

    if (!isOpen) return null;

    const handleAddItem = () => {
        if (!newItemText.trim()) return;
        setItems([...items, {
            text: newItemText,
            quantity: newItemQuantity.trim(),
            category: newItemCategory
        }]);
        setNewItemText('');
        setNewItemQuantity('');
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleSave = () => {
        onSave(mealIndex, dayIndex, items, note);
        onClose();
    };

    const handleCopyItems = () => {
        if (!onSave || copyTargetDay === '') return;
        onSave(mealIndex, dayIndex, items, note, Number(copyTargetDay), copyNoteToTarget);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <header className="modal-header">
                    <h3>Modifica: {DAYS[dayIndex]} - {mealType}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </header>

                <div className="modal-body">
                    <div className="current-items-list">
                        <h4>Alimenti inseriti:</h4>
                        {items.length === 0 && <p className="empty-text">Nessun alimento.</p>}
                        <ul>
                            {items.map((item, idx) => (
                                <li key={idx} className="edit-item-row">
                                    <span className="dot" style={{ backgroundColor: categories[item.category]?.color || '#ccc' }}></span>
                                    <div className="item-details">
                                        <span className="item-text">{item.text}</span>
                                        {item.quantity && <span className="item-quantity">({item.quantity})</span>}
                                    </div>
                                    <button className="delete-btn" onClick={() => handleRemoveItem(idx)}>
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="add-item-form">
                        <h4>Aggiungi alimento:</h4>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Es. Latte"
                                className="input-name"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                            />
                            <input
                                type="text"
                                placeholder="Q.tà (opz)"
                                className="input-quantity"
                                value={newItemQuantity}
                                onChange={(e) => setNewItemQuantity(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                            />
                            <select
                                value={newItemCategory}
                                onChange={(e) => setNewItemCategory(e.target.value)}
                            >
                                {Object.entries(categories).map(([key, cat]) => (
                                    <option key={cat.id || key} value={key}>{cat.label}</option>
                                ))}
                            </select>
                            <button className="add-btn" onClick={handleAddItem}>
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="notes-section" style={{ marginTop: '15px' }}>
                        <h4>Note (opzionale):</h4>
                        <textarea
                            className="note-input"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Es. Pranzo fuori casa..."
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginTop: '5px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div className="copy-section">
                        <h4>Copia alimenti in un altro giorno:</h4>
                        <div className="form-row">
                            <select
                                value={copyTargetDay}
                                onChange={(e) => setCopyTargetDay(e.target.value)}
                            >
                                <option value="">Seleziona giorno...</option>
                                {DAYS.map((day, idx) => (
                                    idx !== dayIndex ? <option key={day} value={idx}>{day}</option> : null
                                ))}
                            </select>
                            <button
                                className="copy-btn"
                                onClick={handleCopyItems}
                                disabled={copyTargetDay === '' || items.length === 0}
                            >
                                Copia alimenti
                            </button>
                            <label className="copy-note-option">
                                <input
                                    type="checkbox"
                                    checked={copyNoteToTarget}
                                    onChange={(e) => setCopyNoteToTarget(e.target.checked)}
                                />
                                Copia anche la nota
                            </label>
                        </div>
                    </div>
                </div>

                <footer className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Annulla</button>
                    <button className="save-btn" onClick={handleSave}>Salva Modifiche</button>
                </footer>
            </div>
        </div>
    );
};
