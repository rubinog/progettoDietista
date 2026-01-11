import React from 'react';
import { MealSection } from './MealSection';
import { Legend } from './Legend';
import './WeeklyTable.css';

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export const WeeklyTable = ({ plan, onCellClick }) => {
    return (
        <div className="weekly-wrapper">
            {/* Decorative Top Bar */}
            <div className="weekly-top-bar"></div>

            <div className="weekly-container">


                <div className="days-header">
                    {DAYS.map(day => (
                        <div key={day} className="day-header-cell">{day}</div>
                    ))}
                </div>

                <div className="table-body">
                    {plan.map((meal, idx) => (
                        <MealSection
                            key={idx}
                            title={meal.type}
                            days={meal.days}
                            onCellClick={onCellClick}
                        />
                    ))}
                </div>

                <Legend />
            </div>
        </div>
    );
};
