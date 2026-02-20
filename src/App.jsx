import React, { useEffect, useRef, useState } from 'react';
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
const DIETA_FILE_EXTENSION = '.dieta';
const DEFAULT_TITLE = 'Schema Dietetico';

const normalizeItems = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      text: String(item?.text || '').trim(),
      quantity: String(item?.quantity || '').trim(),
      category: String(item?.category || '').trim().toUpperCase(),
    }))
    .filter((item) => item.text);
};

const normalizeDayData = (dayData) => {
  if (Array.isArray(dayData)) {
    return normalizeItems(dayData);
  }

  const items = normalizeItems(dayData?.items);
  const note = String(dayData?.note || '');

  if (!note) {
    return items;
  }

  return {
    items,
    note,
  };
};

const normalizePlan = (value) => {
  if (!Array.isArray(value)) {
    throw new Error('Invalid plan format');
  }

  return value.map((meal, index) => {
    const daysSource = Array.isArray(meal?.days) ? meal.days : [];
    const days = Array.from({ length: 7 }, (_, dayIndex) => normalizeDayData(daysSource[dayIndex]));

    return {
      type: String(meal?.type || INITIAL_PLAN[index]?.type || `Pasto ${index + 1}`),
      sectionNote: String(meal?.sectionNote || ''),
      days,
    };
  });
};

const sanitizeFileNamePart = (value, fallback) => {
  const cleaned = String(value || '')
    .replace(/[<>:"/\\|?*]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[.\s]+$/g, '')
    .trim();

  return cleaned || fallback;
};

const formatDateForFilename = (value) => {
  const raw = String(value || '').trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw.replace(/-/g, '');
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0].replace(/-/g, '');
  }

  return new Date().toISOString().split('T')[0].replace(/-/g, '');
};

function App() {
  const [plan, setPlan] = useState(INITIAL_PLAN);
  const fileInputRef = useRef(null);

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
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [disclaimer, setDisclaimer] = useState(DEFAULT_DISCLAIMER);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

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
      setTitle(DEFAULT_TITLE);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditDisclaimer = () => {
    setIsDisclaimerModalOpen(true);
  };

  const handleSaveDietFile = () => {
    try {
      const dietPayload = {
        format: 'progetto-dietista',
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
          plan,
          patientName,
          date,
          title,
          disclaimer,
        },
      };

      const fileContent = JSON.stringify(dietPayload, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      const safePatientName = sanitizeFileNamePart(patientName, 'Paziente');
      const safeTitle = sanitizeFileNamePart(title, DEFAULT_TITLE);
      const safeDate = formatDateForFilename(date);

      downloadLink.href = objectUrl;
      downloadLink.download = `${safePatientName} - ${safeTitle} - ${safeDate}${DIETA_FILE_EXTENSION}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(objectUrl);
      showToast('File dieta salvato con successo.', 'success');
    } catch {
      showToast('Errore durante il salvataggio del file dieta.', 'error');
    }
  };

  const handleLoadDietClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadDietFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      const payload = parsed?.data ? parsed.data : parsed;

      const loadedPlan = normalizePlan(payload?.plan);

      setPlan(loadedPlan);
      setPatientName(String(payload?.patientName || ''));
      setDate(String(payload?.date || new Date().toISOString().split('T')[0]));
      setTitle(String(payload?.title || DEFAULT_TITLE));

      if (payload?.disclaimer) {
        setDisclaimer(String(payload.disclaimer));
      }
      showToast('Schema caricato con successo.', 'success');
    } catch {
      showToast('File non valido. Seleziona un file .dieta esportato dall\'app.', 'error');
    }
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
          onSaveDietFile={handleSaveDietFile}
          onLoadDietFile={handleLoadDietClick}
          onPrint={handlePrint}
          onClear={handleClearPlan}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept={`${DIETA_FILE_EXTENSION},application/json`}
          style={{ display: 'none' }}
          onChange={handleLoadDietFile}
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

        {toast && (
          <div
            className={`app-toast no-print ${toast.type === 'error' ? 'error' : 'success'}`}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {toast.message}
          </div>
        )}
      </div>
    </CategoryProvider>
  );
}

export default App;
