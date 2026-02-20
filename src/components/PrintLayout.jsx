import React, { useEffect, useRef } from 'react';
import './PrintLayout.css';

export const PrintLayout = ({ children, patientName, setPatientName, date, setDate, title, setTitle, disclaimer }) => {
    const layoutRef = useRef(null);

    useEffect(() => {
        const clearPrintDensityClass = () => {
            document.body.classList.remove('print-compact', 'print-very-compact');
        };

        const mmToPx = (valueInMm) => {
            const probe = document.createElement('div');
            probe.style.height = `${valueInMm}mm`;
            probe.style.width = '1px';
            probe.style.position = 'absolute';
            probe.style.visibility = 'hidden';
            probe.style.pointerEvents = 'none';
            document.body.appendChild(probe);
            const pixels = probe.getBoundingClientRect().height;
            document.body.removeChild(probe);

            if (pixels > 0) {
                return pixels;
            }

            return valueInMm * 3.7795275591;
        };

        const applyPrintDensityClass = () => {
            const layoutElement = layoutRef.current;
            if (!layoutElement) {
                return;
            }

            clearPrintDensityClass();

            const printableHeightPx = mmToPx(277);
            const contentHeightPx = layoutElement.scrollHeight;
            const estimatedPages = contentHeightPx / printableHeightPx;

            if (estimatedPages > 1.35 && estimatedPages <= 1.8) {
                document.body.classList.add('print-very-compact');
                return;
            }

            if (estimatedPages > 1.02 && estimatedPages <= 1.35) {
                document.body.classList.add('print-compact');
            }
        };

        const beforePrintHandler = () => {
            applyPrintDensityClass();
        };

        applyPrintDensityClass();

        window.addEventListener('beforeprint', beforePrintHandler);
        window.addEventListener('resize', applyPrintDensityClass);

        if (document.fonts?.ready) {
            document.fonts.ready.then(() => {
                applyPrintDensityClass();
            });
        }

        return () => {
            window.removeEventListener('beforeprint', beforePrintHandler);
            window.removeEventListener('resize', applyPrintDensityClass);
            clearPrintDensityClass();
        };
    }, [children, disclaimer, patientName, date, title]);

    return (
        <div className="print-layout-container" ref={layoutRef}>
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
                    <div className="header-field date-field">
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
                        placeholder="Schema Dietetico"
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
                    {disclaimer}
                </p>
            </footer>
        </div>
    );
};
