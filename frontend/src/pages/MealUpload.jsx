import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Camera, Barcode, Smile, Apple, Sparkles, CheckCircle,
  HelpCircle, Eye, AlertCircle, Plus
} from 'lucide-react';

const MealUpload = () => {
  const navigate = useNavigate();
  
  // Image Uploading States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [detectedFood, setDetectedFood] = useState(null);

  // Barcode Scanning States
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeLoading, setBarcodeLoading] = useState(false);

  // Manual & Logging Editor State
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState(350);
  const [protein, setProtein] = useState(15);
  const [carbs, setCarbs] = useState(40);
  const [fats, setFats] = useState(10);
  const [mood, setMood] = useState('Neutral');
  const [logging, setLogging] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  // Quick barcodes templates for seamless user testing
  const QUICK_BARCODES = [
    { name: 'Maggi Noodles', code: '8901058002477' },
    { name: 'Coca-Cola Can', code: '049000028904' },
    { name: 'Kroger Yogurt', code: '011110038364' },
  ];

  // Quick preset food images for seamless local demo without camera
  const MOCK_FOODS_DEMO = [
    { name: 'Avocado Toast', fileHint: 'egg avocado toast.jpg', img: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500' },
    { name: 'Neapolitan Pizza', fileHint: 'pizza.png', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
    { name: 'Chicken Salad', fileHint: 'chicken breast salad.jpg', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectedFood(null);
    }
  };

  const handleScanAI = async (demoHint = '', demoImg = '') => {
    setScanning(true);
    setDetectedFood(null);
    
    // Simulate AI computing lines animation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('fileNameHint', demoHint || (selectedFile ? selectedFile.name : ''));

      const res = await axios.post('/api/meals/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const food = res.data.detectedFood;
        setDetectedFood(food);
        setMealName(food.name);
        setCalories(food.calories);
        setProtein(food.protein);
        setCarbs(food.carbs);
        setFats(food.fats);
        
        if (demoImg) {
          setPreviewUrl(demoImg);
        }
      }
    } catch (error) {
      console.error('AI Recognition Core Failure:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleBarcodeLookup = async (code) => {
    const lookupCode = code || barcodeInput;
    if (!lookupCode) return;

    setBarcodeLoading(true);
    try {
      const res = await axios.post('/api/meals/barcode', { barcode: lookupCode });
      if (res.data.success) {
        const food = res.data.food;
        setDetectedFood(food);
        setMealName(food.name);
        setCalories(food.calories);
        setProtein(food.protein);
        setCarbs(food.carbs);
        setFats(food.fats);
        setBarcodeInput('');
      }
    } catch (error) {
      console.error('Barcode Lookup Core Failure:', error);
    } finally {
      setBarcodeLoading(false);
    }
  };

  const handleLogMeal = async (e) => {
    e.preventDefault();
    if (!mealName) return;

    setLogging(true);
    try {
      const res = await axios.post('/api/meals', {
        name: mealName,
        calories,
        protein,
        carbs,
        fats,
        imageUrl: previewUrl || '',
        mood,
      });

      if (res.data.success) {
        setLogSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Meal logging database failure:', error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-screen pb-24 lg:pb-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
          Scan & Log Food: <span className="text-emerald-400 text-neon-emerald">BiteAI Scanner</span>
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed font-semibold">
          Identify macronutrients utilizing visual neural mapping or barcode signatures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col: Scanning Inputs */}
        <div className="space-y-6">
          
          {/* Card 1: AI Visual Image Recognition */}
          <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="text-emerald-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Vision Classification</h3>
            </div>

            {/* Dropzone */}
            <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-all relative overflow-hidden bg-white/5 min-h-[180px] flex flex-col justify-center items-center">
              
              {/* Glowing scanning laser bar */}
              {scanning && <div className="scanner-line"></div>}

              {previewUrl ? (
                <div className="relative w-full max-w-[240px] aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={previewUrl} alt="Meal Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => { setPreviewUrl(''); setSelectedFile(null); setDetectedFood(null); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-500/80 text-xs font-bold transition-all cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 group">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform duration-300">
                    <Upload size={22} />
                  </div>
                  <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Choose Meal Photo</span>
                  <span className="text-xs text-gray-500 font-medium">JPEG or PNG. Max 5MB</span>
                  <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                </label>
              )}
            </div>

            {/* Quick Demo preset selection */}
            {!previewUrl && (
              <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Or Quick presets (Demo Classify)</p>
                <div className="flex flex-wrap gap-2">
                  {MOCK_FOODS_DEMO.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setPreviewUrl(preset.img);
                        handleScanAI(preset.fileHint, preset.img);
                      }}
                      className="p-1 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-xs font-semibold text-gray-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles size={12} /> {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scanning Button */}
            {previewUrl && !detectedFood && (
              <button
                onClick={() => handleScanAI()}
                disabled={scanning}
                className="w-full py-2.5 mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold tracking-wide uppercase hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/10 transition-all text-xs"
              >
                {scanning ? 'Running Neural Vision Model...' : 'Execute Vision Model'}
              </button>
            )}
          </div>

          {/* Card 2: Barcode Decoding System */}
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Barcode className="text-cyan-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Barcode Decryption</h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="UPC/EAN Code (e.g. 049000028904)"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 glass-input text-sm text-white"
              />
              <button
                onClick={() => handleBarcodeLookup()}
                disabled={barcodeLoading || !barcodeInput}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase cursor-pointer disabled:opacity-50 transition-all"
              >
                {barcodeLoading ? 'Decoding...' : 'Query'}
              </button>
            </div>

            {/* Quick Test bar buttons */}
            <div className="mt-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Quick-Decode Presets</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_BARCODES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleBarcodeLookup(item.code)}
                    className="p-1 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 text-xs font-semibold text-gray-300 hover:text-cyan-400 transition-all cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Logging Dashboard */}
        <div>
          <div className="glass-panel p-6 rounded-3xl relative h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Logging Ledger Card</h3>
              
              {detectedFood && (
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle size={12} /> AI Calibrated ({Math.round(detectedFood.confidence * 100 || 95)}%)
                </div>
              )}
            </div>

            {logSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle size={18} /> Meal logged into biometric core database!
              </div>
            )}

            <form onSubmit={handleLogMeal} className="space-y-5 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Meal Name Input */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Food Nomenclature</label>
                  <input
                    type="text"
                    placeholder="e.g. Avocado Salad Bowl"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full px-3 py-2.5 glass-input text-sm text-white"
                    required
                  />
                </div>

                {/* Micro sliders breakdown */}
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5 pl-1">
                    <span>Calories</span>
                    <span className="text-emerald-400 font-black">{calories} kcal</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1800"
                    step="10"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-ew-resize bg-white/10 rounded-lg h-1.5"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 pl-1">
                      <span>Protein</span>
                    </div>
                    <input
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(Number(e.target.value))}
                      className="w-full px-2 py-1.5 glass-input text-xs text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 pl-1">
                      <span>Carbs</span>
                    </div>
                    <input
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(Number(e.target.value))}
                      className="w-full px-2 py-1.5 glass-input text-xs text-white"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 pl-1">
                      <span>Fats</span>
                    </div>
                    <input
                      type="number"
                      value={fats}
                      onChange={(e) => setFats(Number(e.target.value))}
                      className="w-full px-2 py-1.5 glass-input text-xs text-white"
                      required
                    />
                  </div>
                </div>

                {/* Mood Based Eating Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Current Cognitive Mood</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { mood: 'Happy', emoji: '😊' },
                      { mood: 'Energetic', emoji: '⚡' },
                      { mood: 'Stressed', emoji: '😰' },
                      { mood: 'Tired', emoji: '😴' },
                      { mood: 'Bored', emoji: '😐' },
                      { mood: 'Neutral', emoji: '🥗' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.mood}
                        onClick={() => setMood(item.mood)}
                        className={`py-2 rounded-xl flex flex-col items-center border text-xs font-bold transition-all cursor-pointer ${
                          mood === item.mood
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-extrabold shadow shadow-emerald-500/10 scale-105'
                            : 'bg-white/5 border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-base mb-0.5">{item.emoji}</span>
                        <span className="text-[9px]">{item.mood}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logger Submitter */}
              <button
                type="submit"
                disabled={logging || !mealName}
                className="w-full py-3.5 mt-8 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold tracking-wide uppercase hover:opacity-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-emerald-500/15 active:scale-[0.99] transition-all text-xs"
              >
                {logging ? 'Synchronizing Biometric Ledger...' : 'Commit Log Entry'}
              </button>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MealUpload;
