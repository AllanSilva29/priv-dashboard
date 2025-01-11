import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { loadPresets, savePreset } from '../utils/config';
import { 
  createInitialState, 
  createSettingsFromState, 
  DashboardState 
} from '../utils/dashboard';
import { ConfigPreset } from '../types';
import { PresetList } from './Dashboard/PresetList';
import { ColorPicker } from './Dashboard/ColorPicker';
import { SliderControl } from './Dashboard/SliderControl';
import { TextAreaControl } from './Dashboard/TextAreaControl';
import { Modal } from './Dashboard/Modal';
import { Controls } from './Dashboard/Controls';
import { Header } from './Dashboard/Header';
import { AutoRotation } from './Dashboard/AutoRotation';

interface DashboardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Dashboard({ isOpen, setIsOpen }: DashboardProps) {
  const store = useStore();
  const [presets, setPresets] = useState<ConfigPreset[]>([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [localState, setLocalState] = useState<DashboardState>(() => 
    createInitialState(store)
  );

  useEffect(() => {
    if (isOpen) {
      loadPresets().then(setPresets);
      setLocalState(createInitialState(store));
    }
  }, [isOpen, store]);

  const handleSave = () => {
    const settings = createSettingsFromState(localState);
    Object.entries(settings).forEach(([key, value]) => {
      const setter = `set${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof store;
      if (typeof store[setter] === 'function') {
        (store[setter] as Function)(value);
      }
    });
    setIsOpen(false);
  };

  const handleExportConfig = () => {
    if (!store.isModified) return;
    setShowExportDialog(true);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    const settings = createSettingsFromState(localState);
    savePreset(newPresetName, settings);
    store.resetModifiedState();
    setShowExportDialog(false);
    setNewPresetName('');
  };

  const handleLoadPreset = (preset: ConfigPreset) => {
    store.loadPreset(preset);
    alert(`Configuration "${preset.name}" loaded successfully!`);
  };

  const handleBlurChange = (blur: number) => {
    store.setBackgroundConfig(store.currentBackground.id, { blur });
  };

  if (!isOpen) return null;

  return (
    <>
      <Controls
        isRotationPaused={store.isRotationPaused}
        onRandomize={() => {
          store.randomizeBackground();
          store.randomizeQuote();
        }}
        onToggleRotation={() => store.setRotationPaused(!store.isRotationPaused)}
      />
      
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <Header
            isModified={store.isModified}
            onSave={handleSave}
            onExport={handleExportConfig}
            onClose={() => setIsOpen(false)}
          />

          <div className="p-6 space-y-6">
            <PresetList
              presets={presets}
              currentPresetId={store.currentPresetId}
              onLoadPreset={handleLoadPreset}
              onEditPreset={() => {}}
            />

            {store.isModified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Current configuration has been modified from the original preset.
                </p>
              </div>
            )}

            <ColorPicker
              label="Time Color"
              value={localState.timeColor}
              onChange={(color) => setLocalState(prev => ({ ...prev, timeColor: color }))}
              onReset={() => setLocalState(prev => ({ ...prev, timeColor: '#ffffff' }))}
            />

            <ColorPicker
              label="Quote Color"
              value={localState.quoteColor}
              onChange={(color) => setLocalState(prev => ({ ...prev, quoteColor: color }))}
              onReset={() => setLocalState(prev => ({ ...prev, quoteColor: '#ffffff' }))}
            />

            <SliderControl
              label="Background Blur"
              value={store.currentBackground.blur}
              min={0}
              max={20}
              unit="px"
              onChange={handleBlurChange}
            />

            <SliderControl
              label="Rotation Interval"
              value={localState.rotationInterval}
              min={5}
              max={300}
              step={5}
              unit=" seconds"
              onChange={(value) => setLocalState(prev => ({ ...prev, rotationInterval: value }))}
            />

            <AutoRotation
              enabled={!localState.isRotationPaused}
              onChange={(enabled) => setLocalState(prev => ({ 
                ...prev, 
                isRotationPaused: !enabled 
              }))}
            />

            <TextAreaControl
              label="Quotes"
              description="One quote per block, text and author on separate lines"
              value={localState.quotesText}
              onChange={(value) => setLocalState(prev => ({ ...prev, quotesText: value }))}
              placeholder="Quote text&#10;Author&#10;&#10;Another quote text&#10;Another author"
            />

            <TextAreaControl
              label="Backgrounds"
              description="One per block, URL and name on separate lines"
              value={localState.backgroundsText}
              onChange={(value) => setLocalState(prev => ({ ...prev, backgroundsText: value }))}
              placeholder="https://example.com/image.jpg&#10;Image Name&#10;&#10;https://example.com/another.jpg&#10;Another Name"
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title="Export Configuration"
        actions={
          <>
            <button
              onClick={() => setShowExportDialog(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreset}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Export
            </button>
          </>
        }
      >
        <p className="text-gray-600 mb-4">
          Enter a name for your configuration preset.
        </p>
        <input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          placeholder="Enter preset name"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </Modal>
    </>
  );
}