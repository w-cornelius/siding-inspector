import React, { useState } from 'react';
import { Plus, Minus, Info, X, Printer, FileText } from 'lucide-react';

const SIDES = ['Front', 'Left', 'Rear', 'Right'];

const COMMON_ITEMS = [
  { 
    id: 'inside_corners', 
    name: 'Inside Corners',
    customSides: ['Front', 'Left', 'Rear', 'Right', 'Front-Left', 'Front-Right', 'Rear-Left', 'Rear-Right', 'Other']
  },
  { 
    id: 'outside_corners', 
    name: 'Outside Corners',
    customSides: ['Front', 'Left', 'Rear', 'Right', 'Front-Left', 'Front-Right', 'Rear-Left', 'Rear-Right', 'Other']
  },
  { id: 'split_mounts', name: 'Split Mounts' },
  { id: 'light_blocks', name: 'Light Blocks' },
  { id: 'window_trim', name: 'Window Trim' },
  { id: 'entry_door_trim', name: 'Entry Door Trim' },
  { id: 'shutters', name: 'Shutter Remove and Reinstall - Pair, not individual' },
  { id: 'chimneys', name: 'Chimneys' },
  { id: 'garage_single', name: 'Garage Door Trim (Single or One Car Garage)' },
  { id: 'garage_double', name: 'Garage Door Trim (Double or Two Car Garage)' }
];

const OTHER_ITEMS = [
  { 
    id: 'townhome', 
    name: '3rd Story or ', 
    clickableWord: 'Townhome',
    definition: 'a multistory house in a modern housing development which is attached to one or more similar houses by shared walls.',
    isToggle: true 
  },
  { 
    id: 'gutters', 
    name: 'Gutters', 
    inputType: 'LFT',
    options: [
      { label: 'Remove and Reinstall', value: 'Remove and Reinstall' },
      { label: 'Remove and Throw Away', value: 'Remove and Throw Away' }
    ]
  },
  { id: 'return_box_caps', name: 'Return Box Caps' },
  { id: 'soffit', name: 'Soffit (24" or Less)', inputType: 'LFT' },
  { id: 'frieze_board', name: 'Frieze Board', inputType: 'LFT' },
  { id: 'band_board', name: 'Band Board', inputType: 'LFT' },
  { id: 'bay_window_trim', name: 'Bay Window Trim' },
  { id: 'porch_ceiling', name: 'Porch Ceiling', inputType: 'SQFT' },
  { 
    id: 'cantilever', 
    name: 'Cantilever Soffit',
    hasDef: true,
    definition: 'A projecting structure, such as an upper story or beam, that extends outward beyond its main support. The cantilever soffit is the material covering the exposed underside of this overhang.',
    inputType: 'LFT'
  },
  { id: 'posts', name: 'Stand Alone Porch Posts: PVC Only | No Capping | Per Post | Per Story' },
  { 
    id: 'gable_vents', 
    name: 'Gable Vent',
    options: [
      { label: 'Small Rectangle', value: 'Small Rectangle' },
      { label: 'Large Rectangle', value: 'Large Rectangle' },
      { label: 'Octagon', value: 'Octagon' },
      { label: 'Circle', value: 'Circle' },
      { label: 'Triangle - Not Available due to Cost', value: 'Triangle', disabled: true }
    ]
  },
  { id: 'std_dormers', name: 'Standard Dormers' },
  { id: 'complex_dormers', name: 'Complex Dormers' },
  { 
    id: 'dryer_vents', 
    name: 'Dryer Vents',
    options: [
      { label: 'Hooded', value: 'Hooded' },
      { label: 'Louvered', value: 'Louvered' }
    ]
  }
];

const EXPORT_ORDER = [
  'gutters',
  'return_box_caps',
  'soffit',
  'frieze_board',
  'band_board',
  'inside_corners',
  'outside_corners',
  'window_trim',
  'bay_window_trim',
  'entry_door_trim',
  'garage_single',
  'garage_double',
  'porch_ceiling',
  'cantilever',
  'posts',
  'gable_vents',
  'std_dormers',
  'complex_dormers',
  'chimneys',
  'shutters',
  'dryer_vents',
  'light_blocks',
  'split_mounts'
];

export default function App() {
  const [itemsData, setItemsData] = useState(() => {
    const initialState = {};
    [...COMMON_ITEMS, ...OTHER_ITEMS].forEach(item => {
      if (item.isToggle) {
        initialState[item.id] = { value: 'No', note: '' };
      } else {
        const itemSides = item.customSides || SIDES;
        const initialQuantities = {};
        
        if (item.options) {
          itemSides.forEach(side => {
            initialQuantities[side] = {};
            item.options.forEach(opt => {
              initialQuantities[side][opt.value] = item.inputType ? '' : 0;
            });
          });
        } else {
          itemSides.forEach(side => {
            initialQuantities[side] = item.inputType ? '' : 0;
          });
        }
        
        initialState[item.id] = {
          quantities: initialQuantities,
          activeSide: itemSides[0],
          selectedOption: item.options ? item.options[0].value : null,
          notes: itemSides.reduce((acc, side) => ({ ...acc, [side]: '' }), {})
        };
      }
    });
    return initialState;
  });

  const [modal, setModal] = useState({ isOpen: false, title: '', content: '' });
  const [expandedNotes, setExpandedNotes] = useState({});

  const handlePrint = () => {
    window.print();
  };

  const setItemOption = (id, optionValue) => {
    setItemsData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        selectedOption: optionValue
      }
    }));
  };

  const toggleNotes = (id) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateNote = (id, side, text) => {
    setItemsData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes: {
          ...prev[id].notes,
          [side]: text
        }
      }
    }));
  };

  const updateToggleNote = (id, text) => {
    setItemsData(prev => ({
      ...prev,
      [id]: { ...prev[id], note: text }
    }));
  };

  const updateInputValue = (id, value) => {
    setItemsData(prev => {
      const itemData = prev[id];
      const currentActive = itemData.activeSide;
      
      if (itemData.selectedOption) {
        const currentOpt = itemData.selectedOption;
        return {
          ...prev,
          [id]: {
            ...itemData,
            quantities: {
              ...itemData.quantities,
              [currentActive]: {
                ...itemData.quantities[currentActive],
                [currentOpt]: value
              }
            }
          }
        };
      } else {
        return {
          ...prev,
          [id]: {
            ...itemData,
            quantities: {
              ...itemData.quantities,
              [currentActive]: value
            }
          }
        };
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setItemsData(prev => {
      const itemData = prev[id];
      const currentActive = itemData.activeSide;
      
      if (itemData.selectedOption) {
        const currentOpt = itemData.selectedOption;
        const newCount = Math.max(0, itemData.quantities[currentActive][currentOpt] + delta);
        return {
          ...prev,
          [id]: {
            ...itemData,
            quantities: {
              ...itemData.quantities,
              [currentActive]: {
                ...itemData.quantities[currentActive],
                [currentOpt]: newCount
              }
            }
          }
        };
      } else {
        const newCount = Math.max(0, itemData.quantities[currentActive] + delta);
        return {
          ...prev,
          [id]: {
            ...itemData,
            quantities: {
              ...itemData.quantities,
              [currentActive]: newCount
            }
          }
        };
      }
    });
  };

  const setActiveSide = (id, side) => {
    setItemsData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        activeSide: side
      }
    }));
  };

  const toggleYesNo = (id, val) => {
    setItemsData(prev => ({
      ...prev,
      [id]: { value: val }
    }));
  };

  const openDefinition = (title, content) => {
    setModal({ isOpen: true, title, content });
  };

  const renderItemCard = (item) => {
    const data = itemsData[item.id];
    const currentSides = item.customSides || SIDES;

    if (item.isToggle) {
      return (
        <div key={item.id} className="bg-slate-900 p-4 sm:p-5 rounded-xl shadow-md border border-slate-800 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-slate-100 font-medium text-lg leading-tight">
              {item.name}
              <button 
                onClick={() => openDefinition(item.clickableWord, item.definition)}
                className="text-blue-400 underline decoration-blue-500/50 decoration-2 underline-offset-4 hover:text-blue-300 focus:outline-none"
              >
                {item.clickableWord}
              </button>
            </div>
            <div className="flex bg-slate-800 rounded-lg p-1 w-full sm:w-auto border border-slate-700">
              <button
                onClick={() => toggleYesNo(item.id, 'Yes')}
                className={`flex-1 sm:w-28 py-3 px-4 rounded-md font-semibold transition-colors ${
                  data.value === 'Yes' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => toggleYesNo(item.id, 'No')}
                className={`flex-1 sm:w-28 py-3 px-4 rounded-md font-semibold transition-colors ${
                  data.value === 'No' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                No
              </button>
            </div>
          </div>
          <div className="mt-4 border-t border-slate-800 pt-4 flex flex-col items-start">
            <button
              onClick={() => toggleNotes(item.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                data.note ? 'text-blue-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <FileText size={16} />
              {data.note ? 'Edit Note' : 'Add Note'}
            </button>
            {expandedNotes[item.id] && (
              <div className="w-full mt-3 animate-in slide-in-from-top-1 fade-in duration-200">
                <textarea
                  value={data.note || ''}
                  onChange={(e) => updateToggleNote(item.id, e.target.value)}
                  placeholder="Type notes here..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px] placeholder-slate-600 resize-y text-base"
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    const getSideCount = (data, side) => {
      if (item.options) {
        return Object.values(data.quantities[side]).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      }
      return parseFloat(data.quantities[side]) || 0;
    };

    const totalQuantity = item.options
      ? currentSides.reduce((total, side) => total + getSideCount(data, side), 0)
      : Object.values(data.quantities).reduce((a, b) => a + (parseFloat(b) || 0), 0);

    const activeQuantity = item.options
      ? data.quantities[data.activeSide][data.selectedOption]
      : data.quantities[data.activeSide];

    // Format total to show clean numbers (no trailing .00 if whole number)
    const displayTotal = totalQuantity % 1 !== 0 ? totalQuantity.toFixed(2) : totalQuantity;

    return (
      <div key={item.id} className="bg-slate-900 p-4 sm:p-5 rounded-xl shadow-md border border-slate-800 mb-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
          <div className="text-slate-100 font-medium text-lg flex-1 w-full pr-2">
            <div className="flex items-center">
              {item.name}
              {item.hasDef && (
                <button 
                  onClick={() => openDefinition(item.name, item.definition)}
                  className="ml-2 inline-flex items-center justify-center text-blue-400 hover:text-blue-300 bg-blue-900/30 p-1.5 rounded-full align-middle focus:outline-none"
                  title="View definition"
                >
                  <Info size={18} />
                </button>
              )}
            </div>
            {item.options && (
              <div className="mt-3 block w-full">
                <select
                  value={data.selectedOption}
                  onChange={(e) => setItemOption(item.id, e.target.value)}
                  className="w-full sm:max-w-[280px] bg-slate-800 border border-slate-700 text-slate-200 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none cursor-pointer shadow-sm appearance-none"
                >
                  {item.options.map(opt => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-slate-800 text-slate-200">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 bg-slate-800 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none border border-slate-700 sm:border-none">
            <div className="bg-slate-800 text-slate-100 px-4 py-2 sm:px-3 sm:py-1.5 rounded-lg font-bold flex items-center gap-2 sm:border sm:border-slate-700 shadow-inner sm:shadow-none">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total</span>
              <span className="text-xl">
                {displayTotal}
                {item.inputType && <span className="text-sm ml-1 text-slate-400">{item.inputType}</span>}
              </span>
            </div>
            {item.options && (
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0 sm:mt-1.5 uppercase tracking-wide text-right hidden sm:block">
                All Types
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {currentSides.map(side => {
            const isActive = data.activeSide === side;
            const sideCount = getSideCount(data, side);
            const hasNote = data.notes && data.notes[side] && data.notes[side].trim() !== '';
            return (
              <button
                key={side}
                onClick={() => setActiveSide(item.id, side)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all focus:outline-none border flex items-center gap-1 ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                    : sideCount > 0
                      ? 'bg-blue-900/40 text-blue-300 border-blue-800/50 hover:bg-blue-800/60'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {side} <span className={`font-bold ${isActive ? 'opacity-90 text-white' : 'opacity-80'}`}>({sideCount})</span>
                {hasNote && <FileText size={12} className={`opacity-80 ml-0.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="font-medium text-slate-300 flex flex-wrap items-center gap-2 text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              {data.activeSide} Count
              {item.options && data.selectedOption && (
                <span className="text-sm bg-slate-700 text-slate-200 px-2 py-0.5 rounded-md border border-slate-600 shadow-sm ml-1 shrink-0">
                  {data.selectedOption}
                </span>
              )}
              <button 
                onClick={() => toggleNotes(item.id)} 
                className={`ml-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  data.notes[data.activeSide] ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <FileText size={16} />
                {data.notes[data.activeSide] ? 'Edit Note' : 'Add Note'}
              </button>
            </span>
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg p-1.5 shrink-0 shadow-sm w-full sm:w-fit justify-between sm:justify-start">
              {item.inputType ? (
                <div className="flex items-center justify-between min-w-[140px] px-2 w-full">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={activeQuantity}
                    onChange={(e) => updateInputValue(item.id, e.target.value)}
                    placeholder="0"
                    className="w-full sm:w-24 text-center font-bold text-2xl text-white bg-slate-900 outline-none py-2 rounded focus:ring-2 focus:ring-blue-500 appearance-none placeholder-slate-600"
                  />
                  <span className="font-semibold text-slate-400 ml-3">{item.inputType}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-14 h-12 sm:w-12 sm:h-10 flex items-center justify-center rounded-md bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500 focus:outline-none transition-colors shadow-sm"
                  >
                    <Minus size={22} />
                  </button>
                  <span className="w-16 sm:w-12 text-center font-bold text-2xl text-white">
                    {activeQuantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-14 h-12 sm:w-12 sm:h-10 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 focus:outline-none transition-colors shadow-sm"
                  >
                    <Plus size={22} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {expandedNotes[item.id] && (
            <div className="w-full animate-in slide-in-from-top-1 fade-in duration-200 mt-1">
              <textarea
                value={data.notes[data.activeSide] || ''}
                onChange={(e) => updateNote(item.id, data.activeSide, e.target.value)}
                placeholder={`Type notes for ${data.activeSide}...`}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px] placeholder-slate-600 resize-y text-base"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-3 sm:p-6 md:p-8 font-sans pb-32 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto print:hidden">
        
        <header className="mb-8 mt-2 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Siding Inspector Helper</h1>
            <p className="text-slate-400 mt-2 text-lg">Track required items and their locations.</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-xl font-semibold transition-colors shadow-lg focus:outline-none shrink-0 w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-500"
          >
            <Printer size={20} />
            Save as PDF
          </button>
        </header>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-5 px-1 flex items-center">
            <div className="w-2 h-7 bg-blue-500 rounded-sm mr-3 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
            Common Items
          </h2>
          <div className="flex flex-col">
            {COMMON_ITEMS.map(renderItemCard)}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-5 px-1 flex items-center">
            <div className="w-2 h-7 bg-slate-600 rounded-sm mr-3"></div>
            Other Items
          </h2>
          <div className="flex flex-col">
            {OTHER_ITEMS.map(renderItemCard)}
          </div>
        </section>

      </div>

      {/* Print View (Hidden on screen, visible on PDF/Print) */}
      <div className="hidden print:block max-w-4xl mx-auto text-black bg-white pt-8">
        <h1 className="text-3xl font-bold mb-6 border-b-2 border-black pb-4 text-black">Project Inspection Report</h1>
        <div className="mb-6 text-lg text-black">
          <span className="font-semibold">3rd Story or Townhome:</span> {itemsData['townhome'].value}
          {itemsData['townhome'].note && <div className="text-sm italic mt-1 text-gray-700">Notes: {itemsData['townhome'].note}</div>}
        </div>
        <table className="w-full text-left border-collapse text-black">
          <thead>
            <tr className="border-b-2 border-black text-lg text-black">
              <th className="py-3 px-2">Item</th>
              <th className="py-3 px-2 text-center">Total</th>
              <th className="py-3 px-2 text-center text-gray-700">Front</th>
              <th className="py-3 px-2 text-center text-gray-700">Left</th>
              <th className="py-3 px-2 text-center text-gray-700">Rear</th>
              <th className="py-3 px-2 text-center text-gray-700">Right</th>
            </tr>
          </thead>
          <tbody>
            {EXPORT_ORDER.map(id => {
              const itemDef = [...COMMON_ITEMS, ...OTHER_ITEMS].find(i => i.id === id);
              if (!itemDef) return null;
              const data = itemsData[id];
              const itemSides = itemDef.customSides || SIDES;
              const validNotes = data.notes ? Object.entries(data.notes).filter(([s, n]) => n.trim() !== '') : [];

              if (itemDef.options) {
                const activeOptions = itemDef.options.filter(opt => {
                  return itemSides.some(side => data.quantities[side][opt.value] > 0);
                });

                if (activeOptions.length === 0) {
                  return (
                    <React.Fragment key={id}>
                      <tr className="border-b border-gray-300">
                        <td className="py-3 px-2 font-medium">{itemDef.name}</td>
                        <td className="py-3 px-2 text-center font-bold text-lg">0</td>
                        {itemDef.customSides ? (
                          <td colSpan={4} className="py-3 px-2 text-center">-</td>
                        ) : (
                          <>
                            <td className="py-3 px-2 text-center">-</td>
                            <td className="py-3 px-2 text-center">-</td>
                            <td className="py-3 px-2 text-center">-</td>
                            <td className="py-3 px-2 text-center">-</td>
                          </>
                        )}
                      </tr>
                      {validNotes.length > 0 && (
                        <tr className="border-b border-gray-300 bg-gray-50">
                          <td colSpan={6} className="py-2 px-3 text-sm italic text-gray-700">
                            <strong>Notes:</strong> {validNotes.map(([s, n]) => `${s}: ${n}`).join(' | ')}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }

                const optionRows = activeOptions.map(opt => {
                  const optTotal = itemSides.reduce((acc, side) => acc + (parseFloat(data.quantities[side][opt.value]) || 0), 0);
                  const displayOptTotal = optTotal % 1 !== 0 ? optTotal.toFixed(2) : optTotal;
                  
                  if (itemDef.customSides) {
                    const breakdown = itemDef.customSides
                      .filter(s => (parseFloat(data.quantities[s][opt.value]) || 0) > 0)
                      .map(s => `${s} (${data.quantities[s][opt.value]})`)
                      .join(', ');
                      
                    return (
                      <tr key={`${id}-${opt.value}`} className="border-b border-gray-300">
                        <td className="py-3 px-2 font-medium">
                          {itemDef.name}
                          <span className="block text-sm text-gray-600 font-normal mt-0.5">
                            Type: {opt.label}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-lg">
                          {displayOptTotal}
                          {itemDef.inputType && <span className="text-sm font-normal text-gray-500 ml-1">{itemDef.inputType}</span>}
                        </td>
                        <td colSpan={4} className="py-3 px-2 text-center text-gray-800">{breakdown || '-'}</td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={`${id}-${opt.value}`} className="border-b border-gray-300">
                      <td className="py-3 px-2 font-medium">
                        {itemDef.name}
                        <span className="block text-sm text-gray-600 font-normal mt-0.5">
                          Type: {opt.label}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-lg">
                        {displayOptTotal}
                        {itemDef.inputType && <span className="text-sm font-normal text-gray-500 ml-1">{itemDef.inputType}</span>}
                      </td>
                      <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Front[opt.value]) > 0 ? data.quantities.Front[opt.value] : '-'}</td>
                      <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Left[opt.value]) > 0 ? data.quantities.Left[opt.value] : '-'}</td>
                      <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Rear[opt.value]) > 0 ? data.quantities.Rear[opt.value] : '-'}</td>
                      <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Right[opt.value]) > 0 ? data.quantities.Right[opt.value] : '-'}</td>
                    </tr>
                  );
                });

                return (
                  <React.Fragment key={id}>
                    {optionRows}
                    {validNotes.length > 0 && (
                      <tr className="border-b border-gray-300 bg-gray-50">
                        <td colSpan={6} className="py-2 px-3 text-sm italic text-gray-700">
                          <strong>Notes:</strong> {validNotes.map(([s, n]) => `${s}: ${n}`).join(' | ')}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }

              const total = Object.values(data.quantities).reduce((a, b) => a + (parseFloat(b) || 0), 0);
              const displayTotal = total % 1 !== 0 ? total.toFixed(2) : total;

              let mainRow;
              if (itemDef.customSides) {
                const breakdown = itemDef.customSides
                  .filter(s => (parseFloat(data.quantities[s]) || 0) > 0)
                  .map(s => `${s} (${data.quantities[s]})`)
                  .join(', ');

                mainRow = (
                  <tr key={id} className="border-b border-gray-300">
                    <td className="py-3 px-2 font-medium">
                      {itemDef.name}
                      {itemDef.options && (
                        <span className="block text-sm text-gray-600 font-normal mt-0.5">
                          Type: {data.selectedOption}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-lg">
                      {displayTotal}
                      {itemDef.inputType && <span className="text-sm font-normal text-gray-500 ml-1">{itemDef.inputType}</span>}
                    </td>
                    <td colSpan={4} className="py-3 px-2 text-center text-gray-800">{breakdown || '-'}</td>
                  </tr>
                );
              } else {
                mainRow = (
                  <tr key={id} className="border-b border-gray-300">
                    <td className="py-3 px-2 font-medium">
                      {itemDef.name}
                      {itemDef.options && (
                        <span className="block text-sm text-gray-600 font-normal mt-0.5">
                          Type: {data.selectedOption}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-lg">
                      {displayTotal}
                      {itemDef.inputType && <span className="text-sm font-normal text-gray-500 ml-1">{itemDef.inputType}</span>}
                    </td>
                    <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Front) > 0 ? data.quantities.Front : '-'}</td>
                    <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Left) > 0 ? data.quantities.Left : '-'}</td>
                    <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Rear) > 0 ? data.quantities.Rear : '-'}</td>
                    <td className="py-3 px-2 text-center">{parseFloat(data.quantities.Right) > 0 ? data.quantities.Right : '-'}</td>
                  </tr>
                );
              }

              return (
                <React.Fragment key={id}>
                  {mainRow}
                  {validNotes.length > 0 && (
                    <tr className="border-b border-gray-300 bg-gray-50">
                      <td colSpan={6} className="py-2 px-3 text-sm italic text-gray-700">
                        <strong>Notes:</strong> {validNotes.map(([s, n]) => `${s}: ${n}`).join(' | ')}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Definition Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm print:hidden">
          <div 
            className="bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in duration-200 border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white">{modal.title}</h3>
              <button 
                onClick={() => setModal({ isOpen: false, title: '', content: '' })}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-300 text-lg leading-relaxed">
                {modal.content}
              </p>
            </div>
            <div className="p-5 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setModal({ isOpen: false, title: '', content: '' })}
                className="px-6 py-3 w-full sm:w-auto bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}