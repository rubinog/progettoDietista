import React, { useEffect, useState } from 'react';
import { PrintLayout } from './components/PrintLayout';
import { FloatingMenu } from './components/FloatingMenu';
import { WeeklyTable } from './components/WeeklyTable';
import { EditModal } from './components/EditModal';
import { CategoryManager } from './components/CategoryManager';
import { DisclaimerModal } from './components/DisclaimerModal';
import { CategoryProvider } from './context/CategoryContext';
import { INITIAL_PLAN } from './data/initialPlan';
import './App.css';

const DEFAULT_DISCLAIMER = 'Il presente schema alimentare ha finalità esclusivamente illustrative. Le indicazioni riportate non rappresentano una prescrizione nutrizionale. In nessun caso tali contenuti possono sostituire il parere, la diagnosi o le istruzioni del medico curante, il quale deve essere interpellato preventivamente, in presenza di patologie o disturbi della salute.';

function App() {
  const [plan, setPlan] = useState(INITIAL_PLAN);

  const [editingCell, setEditingCell] = useState(null);

  const handleCellClick = (mealIndex, dayIndex) => {
    setEditingCell({ mealIndex, dayIndex });
  };

  const handleSaveCell = (mealIndex, dayIndex, newItems, newNote, copyTargetDayIndex = null, copyNoteToTarget = false) => {
    setPlan(prevPlan => {
      return prevPlan.map((meal, currentMealIndex) => {
        if (currentMealIndex === mealIndex) {
          const newDays = [...meal.days];

          if (copyTargetDayIndex !== null && copyTargetDayIndex !== dayIndex) {
            const targetDayData = newDays[copyTargetDayIndex];
            const copiedItems = (newItems || []).map(item => ({ ...item }));
            const copiedNote = String(newNote || '');

            if (Array.isArray(targetDayData)) {
              if (copyNoteToTarget) {
                newDays[copyTargetDayIndex] = {
                  items: copiedItems,
                  note: copiedNote
                };
              } else {
                newDays[copyTargetDayIndex] = copiedItems;
              }
            } else {
              newDays[copyTargetDayIndex] = {
                items: copiedItems,
                note: copyNoteToTarget ? copiedNote : (targetDayData?.note || '')
              };
            }
          } else {
            newDays[dayIndex] = { items: newItems, note: newNote };
          }

          return { ...meal, days: newDays };
        }
        return meal;
      });
    });
    setEditingCell(null);
  };

  const handleSaveMealNote = (mealIndex, sectionNote) => {
    setPlan(prevPlan => prevPlan.map((meal, currentMealIndex) => (
      currentMealIndex === mealIndex
        ? { ...meal, sectionNote }
        : meal
    )));
  };

  const getCellData = () => {
    if (!editingCell) return { items: [], note: '' };
    const meal = plan[editingCell.mealIndex];
    const dayData = meal && meal.days[editingCell.dayIndex] ? meal.days[editingCell.dayIndex] : [];

    if (Array.isArray(dayData)) {
      return { items: dayData, note: '' };
    }
    return { items: dayData.items || [], note: dayData.note || '' };
  };

  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('Schema Dietetico');
  const [disclaimer, setDisclaimer] = useState(DEFAULT_DISCLAIMER);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);

  useEffect(() => {
    const loadDisclaimer = async () => {
      try {
        const response = await fetch('/api/settings/disclaimer');
        if (!response.ok) {
          throw new Error('Unable to load disclaimer');
        }
        const data = await response.json();
        if (data?.disclaimer) {
          setDisclaimer(String(data.disclaimer));
        }
      } catch {
        setDisclaimer(DEFAULT_DISCLAIMER);
      }
    };

    loadDisclaimer();
  }, []);

  const handleClearPlan = () => {
    if (window.confirm('Sei sicuro di voler cancellare tutto il piano? Questa azione non può essere annullata.')) {
      setPlan(prev => prev.map(meal => ({
        ...meal,
        days: Array.from({ length: 7 }, () => []),
        sectionNote: ''
      })));
      setPatientName('');
      setDate(new Date().toISOString().split('T')[0]);
      setTitle('Schema Dietetico');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditDisclaimer = () => {
    setIsDisclaimerModalOpen(true);
  };

  const handleSaveDisclaimer = async (trimmedDisclaimer) => {
    try {
      const response = await fetch('/api/settings/disclaimer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disclaimer: trimmedDisclaimer }),
      });

      if (!response.ok) {
        throw new Error('Unable to save disclaimer');
      }

      const data = await response.json();
      setDisclaimer(String(data?.disclaimer || trimmedDisclaimer));
      return true;
    } catch {
      return false;
    }
  };

  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  return (
    <CategoryProvider>
      <div className="App">
        {/* Floating/Fixed button for Category Management */}
        {/* New Floating Menu replacing the old button stack */}
        <FloatingMenu
          onManageCategories={() => setIsCategoryManagerOpen(true)}
          onEditDisclaimer={handleEditDisclaimer}
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
          disclaimer={disclaimer}
        >
          <WeeklyTable
            plan={plan}
            onCellClick={handleCellClick}
            onMealNoteChange={handleSaveMealNote}
          />
        </PrintLayout>

        <EditModal
          key={editingCell ? `${editingCell.mealIndex}-${editingCell.dayIndex}` : 'closed'}
          isOpen={!!editingCell}
          onClose={() => setEditingCell(null)}
          dayIndex={editingCell?.dayIndex || 0}
          mealType={editingCell ? plan[editingCell.mealIndex]?.type || '' : ''}
          mealIndex={editingCell?.mealIndex ?? 0}
          initialData={getCellData()}
          onSave={handleSaveCell}
        />

        <CategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
        />

        <DisclaimerModal
          isOpen={isDisclaimerModalOpen}
          initialValue={disclaimer}
          defaultValue={DEFAULT_DISCLAIMER}
          onClose={() => setIsDisclaimerModalOpen(false)}
          onSave={handleSaveDisclaimer}
        />
      </div>
    </CategoryProvider>
  );
}

export default App;
