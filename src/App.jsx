import React, { useState } from 'react';
import { PrintLayout } from './components/PrintLayout';
import { WeeklyTable } from './components/WeeklyTable';
import { EditModal } from './components/EditModal';
import { CategoryManager } from './components/CategoryManager';
import { CategoryProvider } from './context/CategoryContext';
import { INITIAL_PLAN } from './data/initialPlan';
import './App.css';

function App() {
  const [plan, setPlan] = useState(INITIAL_PLAN);

  const [editingCell, setEditingCell] = useState(null);

  const handleCellClick = (mealType, dayIndex) => {
    setEditingCell({ mealType, dayIndex });
  };

  const handleSaveCell = (mealType, dayIndex, newItems, newNote) => {
    setPlan(prevPlan => {
      return prevPlan.map(meal => {
        if (meal.type === mealType) {
          const newDays = [...meal.days];
          // Save as object structure
          newDays[dayIndex] = { items: newItems, note: newNote };
          return { ...meal, days: newDays };
        }
        return meal;
      });
    });
    setEditingCell(null);
  };

  const getCellData = () => {
    if (!editingCell) return { items: [], note: '' };
    const meal = plan.find(m => m.type === editingCell.mealType);
    const dayData = meal && meal.days[editingCell.dayIndex] ? meal.days[editingCell.dayIndex] : [];

    // Handle both legacy (array) and new (object) structure
    if (Array.isArray(dayData)) {
      return { items: dayData, note: '' };
    }
    return { items: dayData.items || [], note: dayData.note || '' };
  };

  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  return (
    <CategoryProvider>
      <div className="App">
        {/* Floating/Fixed button for Category Management */}
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 100, display: 'flex', flexDirection: 'column', gap: '10px' }} className="no-print">
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="floating-action-btn"
          >
            ⚙️ Gestisci Categorie
          </button>

          <button
            onClick={() => window.print()}
            className="floating-action-btn"
          >
            🖨️ Stampa PDF
          </button>

          <button
            onClick={() => {
              if (window.confirm('Sei sicuro di voler cancellare tutto il piano? Questa azione non può essere annullata.')) {
                setPlan(prev => prev.map(meal => ({
                  ...meal,
                  days: Array(7).fill([])
                })));
              }
            }}
            className="floating-action-btn clear-btn"
          >
            🗑️ Svuota
          </button>
        </div>

        <PrintLayout>
          <WeeklyTable plan={plan} onCellClick={handleCellClick} />
        </PrintLayout>

        <EditModal
          isOpen={!!editingCell}
          onClose={() => setEditingCell(null)}
          dayIndex={editingCell?.dayIndex || 0}
          mealType={editingCell?.mealType || ''}
          initialData={getCellData()}
          onSave={handleSaveCell}
        />

        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
        />
      </div>
    </CategoryProvider>
  );
}

export default App;
