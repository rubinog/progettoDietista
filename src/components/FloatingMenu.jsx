import React, { useState } from 'react';
import './FloatingMenu.css';
import { Menu, X, Printer, Trash2, Settings, FilePenLine, Save, FolderOpen } from 'lucide-react';

export const FloatingMenu = ({ onManageCategories, onEditDisclaimer, onSaveDietFile, onLoadDietFile, onPrint, onClear }) => {
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
                    onClick={() => { onEditDisclaimer(); setIsOpen(false); }}
                    className="menu-action-btn"
                    title="Modifica Disclaimer"
                >
                    <span className="action-label">Disclaimer</span>
                    <div className="action-icon">
                        <FilePenLine size={20} />
                    </div>
                </button>

                <button
                    onClick={() => { onSaveDietFile(); setIsOpen(false); }}
                    className="menu-action-btn"
                    title="Salva File Dieta"
                >
                    <span className="action-label">Salva</span>
                    <div className="action-icon">
                        <Save size={20} />
                    </div>
                </button>

                <button
                    onClick={() => { onLoadDietFile(); setIsOpen(false); }}
                    className="menu-action-btn"
                    title="Carica File Dieta"
                >
                    <span className="action-label">Carica</span>
                    <div className="action-icon">
                        <FolderOpen size={20} />
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
