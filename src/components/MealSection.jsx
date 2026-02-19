import React from 'react';
import { DayCell } from './DayCell';
import './MealSection.css';

export const MealSection = ({ mealIndex, title, days, sectionNote, onCellClick, onSectionNoteChange }) => {
    // days is array of 7 arrays of items
    // e.g. [ [{text:..}, {text:..}], [], ... ]

    // Ensure we always have 7 days
    const filledDays = Array(7).fill(null).map((_, i) => days[i] || []);

    return (
        <div className="meal-section">
            <div className="meal-title-row">
                <h3>{title}</h3>
            </div>
            <div className="meal-grid-row">
                {filledDays.map((dayData, i) => {
                    const items = Array.isArray(dayData) ? dayData : (dayData?.items || []);
                    const note = !Array.isArray(dayData) && dayData?.note ? dayData.note : '';

                    return (
                        <DayCell
                            key={i}
                            items={items}
                            note={note}
                            onEdit={() => onCellClick(mealIndex, i)}
                        />
                    );
                })}
            </div>
            <div className="meal-note-row">
                <input
                    type="text"
                    className="meal-section-note-input"
                    placeholder="Nota comune per tutta la settimana..."
                    value={sectionNote}
                    onChange={(e) => onSectionNoteChange(e.target.value)}
                />
            </div>
        </div>
    );
};
