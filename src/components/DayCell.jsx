import React from 'react';
import { FoodItem } from './FoodItem';
import './DayCell.css';

export const DayCell = ({ items, note, onEdit }) => {
    return (
        <div className="day-cell" onClick={onEdit}>
            {items && items.length > 0 ? (
                <>
                    {items.map((item, idx) => (
                        <FoodItem key={idx} item={item} />
                    ))}
                    {note && <div className="cell-note">{note}</div>}
                </>
            ) : (
                note ? <div className="cell-note">{note}</div> : <div className="empty-cell-placeholder" />
            )}
        </div>
    );
};
