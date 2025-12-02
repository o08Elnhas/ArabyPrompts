import React, { useState, useRef } from 'react';
import { Sparkles, Copy, Check, Video, Aperture, Clock, RefreshCw, History, Wand2, X, Image as ImageIcon, Upload } from 'lucide-react';
import { generateVideoPrompt, translateToArabic, magicEnhancePrompt, translateAndRefineText, imageToPrompt } from '../services/geminiService';
import { PromptStyle, HistoryItem } from '../types';

interface GeneratorProps {
  styles: PromptStyle[];
}

export const Generator: React.FC<GeneratorProps> = ({ styles }) => {
  // Tabs: 'text' or 'image'
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  // Text Mode State
  const [topic, setTopic] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState(styles[0]?.id || '');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [targetModel, setTargetModel] = useState('Midjourney');
  const [negativePrompt, setNegativePrompt] = useState('');
  
  // Image Mode State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shared Output State
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [arabicTranslation, setArabicTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Feature 4: Session-Based History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleMagicEnhance = async () => {
    if (!topic) return;
    setIsEnhancing(true);
    try {
      const enhanced = await magicEnhancePrompt(topic);
      setTopic(enhanced);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateText = async () => {
    if (!topic) return;
    setIsLoading(true);
    setGeneratedPrompt('');
    setArabicTranslation('');
    
    try {
      // Feature 1: Intelligent Translation Layer
      const englishBase = await translateAndRefineText(topic);
      
      const selectedStyle = styles.find(s => s.id === selectedStyleId);
      const styleSuffix = selectedStyle ? selectedStyle.suffix : '';

      // Feature 2: Dynamic Negative Prompt System passed to service
      const result = await generateVideoPrompt(
        englishBase, 
        styleSuffix, 
        aspectRatio, 
        targetModel, 
        negativePrompt
      );
      
      setGeneratedPrompt(result);

      // Add to History
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        originalIdea: topic.substring(0, 30) + (topic.length > 30 ? '...' : ''),
        generatedPrompt: result,
        modelUsed: targetModel
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      // Translate back for understanding
      const translated = await translateToArabic(result);
      setArabicTranslation(translated);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        
        // Extract base64 and mime
        const matches = result.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          setImageMimeType(matches[1]);
          setImageBase64(matches[2]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImageToPrompt = async () => {
    if (!imageBase64 || !imageMimeType) return;
    setIsLoading(true);
    setGeneratedPrompt('');
    setArabicTranslation('');

    try {
        const result = await imageToPrompt(imageBase64, imageMimeType);
        setGeneratedPrompt(result);

        // Add to History
        const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            originalIdea: "تحليل صورة",
            generatedPrompt: result,
            modelUsed: "Gemini Vision"
        };
        setHistory(prev => [newHistoryItem, ...prev]);

        // Translate back
        const translated = await translateToArabic(result);
        setArabicTranslation(translated);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-6 relative">
      {/* Feature 4: History Sidebar (Toggleable on mobile) */}
      <div className={`fixed inset-y-0 right-0 z-40 w-80 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                 <History className="w-5 h-5" /> سجل الجلسة
              </h3>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                 <X className="w-5 h-5" />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {history.length === 0 ? (
                 <p className="text-slate-500 text-center text-sm py-10">لا يوجد سجل حتى الآن.</p>
              ) : (
                 history.map(item => (
                    <div key={item.id} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">{item.modelUsed}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                       </div>
                       <p className="text-slate-700 dark:text-slate-300 mb-2 line-clamp-2" title={item.originalIdea}>
                          "{item.originalIdea}"
                       </p>
                       <button 
                         onClick={() => {
                             navigator.clipboard.writeText(item.generatedPrompt);
                         }}
                         className="w-full py-1.5 flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                       >
                          <Copy className="w-3 h-3" /> نسخ البرومت
                       </button>
                    </div>
                 ))
              )}
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 w-full">
        <div className="text-center space-y-4 relative">
           <button 
             onClick={() => setShowHistory(true)}
             className="absolute top-0 right-0 md:right-[-50px] p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md transition-all text-slate-600 dark:text-slate-300"
             title="سجل التاريخ"
           >
              <History className="w-5 h-5" />
           </button>

          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent pb-2">
            صانع البرومتات الذكي
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            اختر طريقتك المفضلة لتوليد الوصف: من فكرة نصية أو بتحليل صورة موجودة.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button 
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-4 text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'text' 
                        ? 'bg-slate-50 dark:bg-slate-700/50 text-emerald-600 border-b-2 border-emerald-500' 
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <TypeIcon className="w-5 h-5" />
                    من نص (فكرة)
                </button>
                <button 
                    onClick={() => setActiveTab('image')}
                    className={`flex-1 py-4 text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-colors ${
                        activeTab === 'image' 
                        ? 'bg-slate-50 dark:bg-slate-700/50 text-emerald-600 border-b-2 border-emerald-500' 
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <ImageIcon className="w-5 h-5" />
                    من صورة إلى برومبت
                </button>
            </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {activeTab === 'text' ? (
                // --- TEXT MODE ---
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                            فكرة الفيديو
                            </label>
                            <button 
                                onClick={handleMagicEnhance}
                                disabled={isEnhancing || !topic}
                                className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 px-2 py-1 rounded transition-colors"
                            >
                                {isEnhancing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                Magic Enhance
                            </button>
                        </div>
                        <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="مثال: رائد فضاء يمشي في سوق شعبي قديم في القاهرة..."
                        className="w-full h-24 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-lg focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Advanced Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                            <Video className="w-4 h-4" /> الموديل المستهدف
                        </label>
                        <select
                            value={targetModel}
                            onChange={(e) => setTargetModel(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                        >
                            <option value="Midjourney">Midjourney (v6)</option>
                            <option value="Stable Diffusion">Stable Diffusion</option>
                            <option value="DALL-E 3">DALL-E 3</option>
                        </select>
                        </div>

                        <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                            <Aperture className="w-4 h-4" /> النمط البصري
                        </label>
                        <select
                            value={selectedStyleId}
                            onChange={(e) => setSelectedStyleId(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                        >
                            {styles.map(style => (
                                <option key={style.id} value={style.id}>{style.label}</option>
                            ))}
                        </select>
                        </div>
                        
                        <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                            <Video className="w-4 h-4" /> الأبعاد
                        </label>
                        <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                        >
                            <option value="16:9">عريض (YouTube) 16:9</option>
                            <option value="9:16">طولي (TikTok) 9:16</option>
                            <option value="1:1">مربع (Instagram) 1:1</option>
                            <option value="21:9">سينما (Movie) 21:9</option>
                        </select>
                        </div>
                    </div>

                    {/* Feature 2: Negative Prompt UI */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                            عناصر مستبعدة (Negative Prompt)
                        </label>
                        <textarea
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="عناصر لا تريدها في الفيديو (مثال: نص، تشويش، جودة منخفضة)..."
                            className="w-full h-16 p-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                        />
                    </div>
                    </div>

                    <button
                    onClick={handleGenerateText}
                    disabled={isLoading || !topic}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                    {isLoading ? (
                        <>
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        جاري المعالجة...
                        </>
                    ) : (
                        <>
                        <Sparkles className="w-6 h-6" />
                        توليد البرومت الاحترافي
                        </>
                    )}
                    </button>
                </div>
            ) : (
                // --- IMAGE MODE ---
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleImageUpload}
                        />
                        {selectedImage ? (
                            <div className="relative inline-block">
                                <img src={selectedImage} alt="Uploaded" className="max-h-64 rounded-lg shadow-md mx-auto" />
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(null);
                                        setImageBase64(null);
                                        setImageMimeType('');
                                    }}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <p className="text-sm text-slate-500 mt-2">انقر لتغيير الصورة</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">ارفع الصورة هنا لتحليلها</h3>
                                    <p className="text-slate-500">JPG, PNG, JPEG</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleGenerateImageToPrompt}
                        disabled={isLoading || !imageBase64}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <>
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            جاري تحليل الصورة...
                            </>
                        ) : (
                            <>
                            <Sparkles className="w-6 h-6" />
                            استخراج البرومبت السحري
                            </>
                        )}
                    </button>
                </div>
            )}
          </div>

          {/* Results Area (Shared for both modes) */}
          {(generatedPrompt || isLoading) && (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 border-t border-slate-200 dark:border-slate-700">
               {isLoading ? (
                 <div className="flex flex-col items-center justify-center py-12 space-y-4">
                   <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-slate-500 animate-pulse">
                       {activeTab === 'text' ? 'جاري الترجمة والصياغة الاحترافية...' : 'جاري تحليل تفاصيل الصورة واستخراج الوصف...'}
                   </p>
                 </div>
               ) : (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                       <Check className="w-5 h-5" />
                       {activeTab === 'text' ? `النتيجة لـ ${targetModel}` : 'الوصف المستخرج من الصورة'}
                     </h3>
                     <button
                      onClick={() => handleCopy(generatedPrompt)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        copied 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      } border border-slate-200 dark:border-slate-700`}
                     >
                       {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       {copied ? 'تم النسخ' : 'نسخ النص'}
                     </button>
                   </div>
                   
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative group">
                     <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-mono" dir="ltr">
                       {generatedPrompt}
                     </p>
                   </div>

                   {arabicTranslation && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">ترجمة المحتوى (للتأكد من المعنى):</h4>
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                              {arabicTranslation}
                          </p>
                      </div>
                   )}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TypeIcon = (props: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" x2="15" y1="20" y2="20" />
      <line x1="12" x2="12" y1="4" y2="20" />
    </svg>
);
