import React, { useState } from 'react';
import './FloatingMenu.css';
import { Menu, X, Printer, Trash2, Settings } from 'lucide-react';

export const FloatingMenu = ({ onManageCategories, onPrint, onClear }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="floating-menu-container no-print">
            {/* Sub-buttons (Actions) */}
            <div className={`menu-actions ${isOpen ? 'open' : ''}`}>
                <button
                    onClick={() => { onManageCategories(); setIsOpen(false); }}
                    className="menu-action-btn"
                    title="Gestisci Categorie"
                >
                    <span className="action-label">Categorie</span>
                    <div className="action-icon">
                        <Settings size={20} />
                    </div>
                </button>

                <button
                    onClick={() => { onPrint(); setIsOpen(false); }}
                    className="menu-action-btn"
                    title="Stampa PDF"
                >
                    <span className="action-label">Stampa</span>
                    <div className="action-icon">
                        <Printer size={20} />
                    </div>
                </button>

                <button
                    onClick={() => { onClear(); setIsOpen(false); }}
                    className="menu-action-btn clear-action"
                    title="Svuota Piano"
                >
                    <span className="action-label">Svuota</span>
                    <div className="action-icon">
                        <Trash2 size={20} />
                    </div>
                </button>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={toggleMenu}
                className={`main-toggle-btn ${isOpen ? 'open' : ''}`}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
    );
};
