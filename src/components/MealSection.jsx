import React from 'react';
import { DayCell } from './DayCell';
import './MealSection.css';

export const MealSection = ({ title, days, onCellClick }) => {
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
                            onEdit={() => onCellClick(title, i)}
                        />
                    );
                })}
            </div>
        </div>
    );
};
