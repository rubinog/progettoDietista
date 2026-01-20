import React, { useState } from 'react';
import { PrintLayout } from './components/PrintLayout';
import { FloatingMenu } from './components/FloatingMenu';
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

  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('Schema dietetico 1 settimana');

  const handleClearPlan = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutto il piano? Questa azione non può essere annullata.')) {
      setPlan(prev => prev.map(meal => ({
        ...meal,
        days: Array(7).fill([])
      })));
      setPatientName('');
      setDate(new Date().toISOString().split('T')[0]);
      setTitle('Schema Dietetico');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  return (
    <CategoryProvider>
      <div className="App">
        {/* Floating/Fixed button for Category Management */}
        {/* New Floating Menu replacing the old button stack */}
        <FloatingMenu
          onManageCategories={() => setIsCategoryManagerOpen(true)}
          onPrint={handlePrint}
          onClear={handleClearPlan}
        />

        <PrintLayout
          patientName={patientName}
          setPatientName={setPatientName}
          date={date}
          setDate={setDate}
          title={title}
          setTitle={setTitle}
        >
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
