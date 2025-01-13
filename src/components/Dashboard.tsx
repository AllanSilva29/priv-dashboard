import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { loadPresets, saveUserPreset, updateUserPreset, exportPreset, deleteUserPreset } from '../utils/config';
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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [editingPreset, setEditingPreset] = useState<ConfigPreset | null>(null);
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

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const settings = createSettingsFromState(localState);
    const newPreset = saveUserPreset(presetName, settings);
    
    setPresets(prev => [newPreset, ...prev]);
    store.resetModifiedState();
    setShowSaveDialog(false);
    setPresetName('');
  };

  const handleEditPreset = (preset: ConfigPreset) => {
    setEditingPreset(preset);
    setPresetName(preset.name);
    setShowEditDialog(true);
  };

  const handleUpdatePreset = () => {
    if (!editingPreset || !presetName.trim()) return;

    const settings = createSettingsFromState(localState);
    updateUserPreset(editingPreset.id, presetName, settings);
    
    loadPresets().then(setPresets);
    store.resetModifiedState();
    setShowEditDialog(false);
    setEditingPreset(null);
    setPresetName('');
  };

  const handleLoadPreset = (preset: ConfigPreset) => {
    store.loadPreset(preset);
    setLocalState(createInitialState(store));
    alert(`Configuration "${preset.name}" loaded successfully!`);
  };

  const handleDeletePreset = (preset: ConfigPreset) => {
    if (window.confirm(`Are you sure you want to delete the preset "${preset.name}"?`)) {
      deleteUserPreset(preset.id);
      loadPresets().then(setPresets);
      if (preset.id === store.currentPresetId) {
        // If the current preset is deleted, load the first available preset
        loadPresets().then(updatedPresets => {
          if (updatedPresets.length > 0) {
            store.loadPreset(updatedPresets[0]);
          }
        });
      }
    }
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
            onSave={handleSave}
            onExport={() => setShowSaveDialog(true)}
            onClose={() => setIsOpen(false)}
          />

          <div className="p-6 space-y-6">
            <PresetList
              presets={presets}
              currentPresetId={store.currentPresetId}
              onLoadPreset={handleLoadPreset}
              onEditPreset={handleEditPreset}
              onExportPreset={exportPreset}
              onDeletePreset={handleDeletePreset}
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
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        title="Save User Preset"
        actions={
          <>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreset}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </>
        }
      >
        <p className="text-gray-600 mb-4">
          Enter a name for your preset configuration.
        </p>
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Enter preset name"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </Modal>

      <Modal
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setEditingPreset(null);
          setPresetName('');
        }}
        title="Edit User Preset"
        actions={
          <>
            <button
              onClick={() => {
                setShowEditDialog(false);
                setEditingPreset(null);
                setPresetName('');
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdatePreset}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update
            </button>
          </>
        }
      >
        <p className="text-gray-600 mb-4">
          Update the name of your preset configuration.
        </p>
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Enter preset name"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </Modal>
    </>
  );
}