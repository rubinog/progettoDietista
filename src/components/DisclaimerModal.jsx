import React, { useEffect, useState } from 'react';
import './DisclaimerModal.css';

export const DisclaimerModal = ({ isOpen, initialValue, defaultValue, onClose, onSave }) => {
    const [text, setText] = useState(initialValue || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setText(initialValue || '');
            setError('');
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const handleSave = async () => {
        const trimmed = String(text || '').trim();

        if (!trimmed) {
            setError('Il disclaimer non può essere vuoto.');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const ok = await onSave(trimmed);
            if (ok) {
                onClose();
            } else {
                setError('Errore nel salvataggio del disclaimer.');
            }
        } catch {
            setError('Errore nel salvataggio del disclaimer.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRestoreDefault = () => {
        setText(String(defaultValue || ''));
        setError('');
    };

    return (
        <div className="disclaimer-modal-overlay">
            <div className="disclaimer-modal-content">
                <header className="disclaimer-modal-header">
                    <h3>Modifica Disclaimer</h3>
                </header>

                <div className="disclaimer-modal-body">
                    <textarea
                        className="disclaimer-textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={8}
                    />
                    {error && <p className="disclaimer-error">{error}</p>}
                </div>

                <footer className="disclaimer-modal-footer">
                    <button className="restore-btn" onClick={handleRestoreDefault} disabled={isSaving}>Ripristina default</button>
                    <button className="cancel-btn" onClick={onClose} disabled={isSaving}>Annulla</button>
                    <button className="save-btn" onClick={handleSave} disabled={isSaving}>Salva</button>
                </footer>
            </div>
        </div>
    );
};
