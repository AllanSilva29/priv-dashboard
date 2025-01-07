import React from 'react';
import { X, SkipForward, Save, Pause, Play, RotateCcw } from 'lucide-react';
import { useStore } from '../store';

export function Dashboard({ isOpen, setIsOpen }: DashboardProps) {
  const store = useStore();
  const [localState, setLocalState] = React.useState({
    quotesText: '',
    backgroundsText: '',
    timeColor: '',
    quoteColor: '',
    blur: 0,
    rotationInterval: 30,
    isRotationPaused: false
  });

  React.useEffect(() => {
    if (isOpen) {
      setLocalState({
        quotesText: store.quotes.map(q => `${q.text}\n${q.author}`).join('\n\n'),
        backgroundsText: store.backgrounds.map(b => `${b.url}\n${b.name}`).join('\n\n'),
        timeColor: store.timeColor,
        quoteColor: store.quoteColor,
        blur: store.blur,
        rotationInterval: store.rotationInterval,
        isRotationPaused: store.isRotationPaused
      });
    }
  }, [isOpen, store]);

  const handleSave = () => {
    store.setTimeColor(localState.timeColor);
    store.setQuoteColor(localState.quoteColor);
    store.setBlur(localState.blur);
    store.setQuotes(localState.quotesText);
    store.setBackgrounds(localState.backgroundsText);
    store.setRotationInterval(localState.rotationInterval);
    store.setRotationPaused(localState.isRotationPaused);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed top-4 left-4 flex gap-2">
        <button
          onClick={() => {
            store.randomizeBackground();
            store.randomizeQuote();
          }}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
          title="Change Background & Quote"
        >
          <SkipForward className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => store.setRotationPaused(!store.isRotationPaused)}
          className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
          title={store.isRotationPaused ? "Resume Rotation" : "Pause Rotation"}
        >
          {store.isRotationPaused ? (
            <Play className="w-6 h-6" />
          ) : (
            <Pause className="w-6 h-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Dashboard Settings</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 p-2 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block font-medium">Time Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={localState.timeColor}
                    onChange={(e) => setLocalState(prev => ({ ...prev, timeColor: e.target.value }))}
                    className="w-16 h-10 cursor-pointer rounded-lg"
                  />
                  <span className="text-sm text-gray-600">{localState.timeColor}</span>
                  <button
                    onClick={() => setLocalState(prev => ({ ...prev, timeColor: '#ffffff' }))}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Quote Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={localState.quoteColor}
                    onChange={(e) => setLocalState(prev => ({ ...prev, quoteColor: e.target.value }))}
                    className="w-16 h-10 cursor-pointer rounded-lg"
                  />
                  <span className="text-sm text-gray-600">{localState.quoteColor}</span>
                  <button
                    onClick={() => setLocalState(prev => ({ ...prev, quoteColor: '#ffffff' }))}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Background Blur ({localState.blur}px)</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={localState.blur}
                  onChange={(e) => setLocalState(prev => ({ ...prev, blur: Number(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Rotation Interval ({localState.rotationInterval} seconds)</label>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={localState.rotationInterval}
                  onChange={(e) => setLocalState(prev => ({ ...prev, rotationInterval: Number(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Auto Rotation</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!localState.isRotationPaused}
                    onChange={(e) => setLocalState(prev => ({ ...prev, isRotationPaused: !e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span>Enable automatic background & quote rotation</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Quotes</label>
                <p className="text-sm text-gray-600 mb-2">One quote per block, text and author on separate lines</p>
                <textarea
                  value={localState.quotesText}
                  onChange={(e) => setLocalState(prev => ({ ...prev, quotesText: e.target.value }))}
                  className="w-full h-40 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Quote text&#10;Author&#10;&#10;Another quote text&#10;Another author"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium">Backgrounds</label>
                <p className="text-sm text-gray-600 mb-2">One per block, URL and name on separate lines</p>
                <textarea
                  value={localState.backgroundsText}
                  onChange={(e) => setLocalState(prev => ({ ...prev, backgroundsText: e.target.value }))}
                  className="w-full h-40 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg&#10;Image Name&#10;&#10;https://example.com/another.jpg&#10;Another Name"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}