
import React, { useState, useRef } from 'react';
import { Stethoscope, Image as ImageIcon, Sparkles, Upload, X, ArrowRight, Activity } from 'lucide-react';
import { analyzePrompt, imageToPrompt, translateToArabic } from '../services/geminiService';

export const AITools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'doctor' | 'reverse'>('doctor');

  // Doctor State
  const [doctorInput, setDoctorInput] = useState('');
  const [doctorResult, setDoctorResult] = useState('');
  const [isDoctorLoading, setIsDoctorLoading] = useState(false);

  // Reverse State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [reverseResult, setReverseResult] = useState('');
  const [reverseLoading, setReverseLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDoctorAnalyze = async () => {
    if (!doctorInput) return;
    setIsDoctorLoading(true);
    try {
      const result = await analyzePrompt(doctorInput);
      setDoctorResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDoctorLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        const matches = result.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          setImageMimeType(matches[1]);
          setImageBase64(matches[2]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReverseEngineer = async () => {
    if (!imageBase64) return;
    setReverseLoading(true);
    try {
      const result = await imageToPrompt(imageBase64, imageMimeType);
      setReverseResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setReverseLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">أدوات الذكاء الاصطناعي المتقدمة</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">أدوات احترافية لتحسين نتائجك وفهم الصور</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tool Selector Cards */}
        <button 
          onClick={() => setActiveTool('doctor')}
          className={`p-6 rounded-2xl border-2 text-right transition-all ${activeTool === 'doctor' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${activeTool === 'doctor' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">طبيب البرومت</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">تحليل البرومت الخاص بك واقتراح تحسينات لرفع الجودة.</p>
        </button>

        <button 
          onClick={() => setActiveTool('reverse')}
          className={`p-6 rounded-2xl border-2 text-right transition-all ${activeTool === 'reverse' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${activeTool === 'reverse' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">هندسة عكسية للصور</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">استخراج الوصف الدقيق من أي صورة باستخدام Vision AI.</p>
        </button>
      </div>

      {/* Workspace */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl min-h-[400px]">
        {activeTool === 'doctor' ? (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">تحليل وتحسين البرومت</h2>
            </div>
            
            <div className="space-y-4">
              <label className="block font-bold text-slate-700 dark:text-slate-300">ضع البرومت هنا:</label>
              <textarea 
                value={doctorInput}
                onChange={(e) => setDoctorInput(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                placeholder="Ex: A cat sitting on a wall..."
              />
              <button 
                onClick={handleDoctorAnalyze}
                disabled={isDoctorLoading || !doctorInput}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isDoctorLoading ? <Sparkles className="animate-spin" /> : <Stethoscope />}
                فحص البرومت
              </button>
            </div>

            {doctorResult && (
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-emerald-600 mb-4">تقرير التحليل:</h3>
                <div className="prose dark:prose-invert max-w-none text-left" dir="ltr">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300">{doctorResult}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">استخراج الوصف من الصورة</h2>
            </div>

            <div 
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              
              {selectedImage ? (
                <div className="relative inline-block">
                  <img src={selectedImage} alt="Upload" className="max-h-64 rounded-lg shadow-md" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-600 dark:text-slate-300">اضغط لرفع صورة</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleReverseEngineer}
              disabled={reverseLoading || !selectedImage}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {reverseLoading ? <Sparkles className="animate-spin" /> : <Sparkles />}
              تحليل واستخراج
            </button>

            {reverseResult && (
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-purple-600 mb-4">الوصف المستخرج:</h3>
                <p className="font-mono text-sm text-slate-800 dark:text-slate-200 leading-relaxed" dir="ltr">
                  {reverseResult}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
