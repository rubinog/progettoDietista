import React, { useState } from 'react';
import './PrintLayout.css';

export const PrintLayout = ({ children }) => {
    // Default values
    const [patientName, setPatientName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [title, setTitle] = useState('Schema dietetico 1 settimana');

    // handlePrint moved to App.jsx

    return (
        <div className="print-layout-container">
            {/* Controls for Printing (Hidden when printing) */}
            {/* Controls for Printing (Moved to App.jsx) */}

            {/* Print Header */}
            <header className="print-header">
                <div className="header-row">
                    <div className="header-field">
                        <label className="no-print">Paziente:</label>
                        <input
                            type="text"
                            className="print-input patient-name"
                            placeholder="Nome e Cognome"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                        />
                    </div>
                    <div className="header-field">
                        <label className="no-print">Data:</label>
                        <input
                            type="date"
                            className="print-input diet-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="header-row title-row">
                    <input
                        type="text"
                        className="print-input diet-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
            </header>

            {/* Main Content (Weekly Table) */}
            <div className="print-content">
                {children}
            </div>

            {/* Print Footer */}
            <footer className="print-footer">
                <p>
                    Il presente schema alimentare ha finalità esclusivamente illustrative.
                    Le indicazioni riportate non rappresentano una prescrizione nutrizionale.
                    In nessun caso tali contenuti possono sostituire il parere, la diagnosi o le istruzioni del medico curante,
                    il quale deve essere interpellato preventivamente, in presenza di patologie o disturbi della salute.
                </p>
            </footer>
        </div>
    );
};
