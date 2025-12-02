
import React, { useState } from 'react';
import { User, Settings, Award, Grid, Bookmark, CreditCard, Edit, Save, Crown } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Edit Form State
  const [formData, setFormData] = useState({
      bio: user.bio || '',
      phone: user.phone || '',
      country: user.country || '',
      jobTitle: user.jobTitle || '',
      linkedin: user.socials?.linkedin || '',
  });

  const handleSave = () => {
      // Simulate save
      setIsEditing(false);
      alert("تم حفظ البيانات بنجاح!");
  };

  const handleUpgrade = () => {
      alert("جاري تحويلك لبوابة الدفع... (محاكاة: تم الترقية إلى Pro!)");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 pt-4">
            <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-700 shadow-lg" />
                {user.plan === 'Pro' && (
                    <div className="absolute bottom-1 right-1 bg-yellow-400 text-yellow-900 p-1.5 rounded-full border-2 border-white" title="Pro Member">
                        <Crown className="w-5 h-5 fill-current" />
                    </div>
                )}
            </div>
            
            <div className="flex-1 text-center md:text-right space-y-2 mb-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                    {user.name}
                    {user.plan === 'Pro' && <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full border border-emerald-200 align-middle">PRO</span>}
                </h2>
                <p className="text-slate-500 font-medium">{user.jobTitle || 'مبدع فيديو'} • {user.country || 'العالم العربي'}</p>
                <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                    <div className="text-center">
                        <span className="block font-bold text-lg text-slate-900 dark:text-white">{user.stats.prompts}</span>
                        <span className="text-xs text-slate-500">برومت</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg text-slate-900 dark:text-white">{user.points}</span>
                        <span className="text-xs text-slate-500">نقطة</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg text-slate-900 dark:text-white">{user.rankTitle}</span>
                        <span className="text-xs text-slate-500">الرتبة</span>
                    </div>
                </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 ${isEditing ? 'bg-slate-200 text-slate-800' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                    {isEditing ? <><Settings className="w-4 h-4" /> إلغاء</> : <><Edit className="w-4 h-4" /> تعديل</>}
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content / Edit Form */}
        <div className="lg:col-span-2 space-y-6">
             {isEditing ? (
                 <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in">
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">تعديل البيانات الشخصية</h3>
                     <div className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">المسمى الوظيفي</label>
                                 <input 
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900" 
                                    placeholder="مثال: مصمم جرافيك"
                                 />
                             </div>
                             <div>
                                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">الدولة</label>
                                 <select 
                                    value={formData.country}
                                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                                 >
                                     <option value="">اختر الدولة</option>
                                     <option value="Saudi Arabia">السعودية</option>
                                     <option value="Egypt">مصر</option>
                                     <option value="UAE">الإمارات</option>
                                 </select>
                             </div>
                         </div>
                         <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">نبذة عني (Bio)</label>
                             <textarea 
                                value={formData.bio}
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 h-32 resize-none"
                                placeholder="أكتب نبذة مختصرة عن مهاراتك..."
                             />
                         </div>
                         <div>
                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">رابط LinkedIn</label>
                             <input 
                                value={formData.linkedin}
                                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                                placeholder="https://linkedin.com/in/..."
                             />
                         </div>
                         <button onClick={handleSave} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex justify-center gap-2">
                             <Save className="w-5 h-5" /> حفظ التغييرات
                         </button>
                     </div>
                 </div>
             ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 min-h-[300px]">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-emerald-500" />
                        عن المستخدم
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {user.bio || "لا توجد نبذة شخصية بعد. قم بتعديل الملف لإضافة معلوماتك."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <span className="block text-slate-400 text-xs mb-1">انضم منذ</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{user.joinDate || 'Jan 2024'}</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <span className="block text-slate-400 text-xs mb-1">آخر نشاط</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{user.lastActive || 'الآن'}</span>
                        </div>
                    </div>
                </div>
             )}
        </div>

        {/* Right: Subscription & Status */}
        <div className="space-y-6">
            <div className={`rounded-2xl p-6 border-2 ${user.plan === 'Pro' ? 'bg-slate-900 border-yellow-500 text-white' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <CreditCard className={user.plan === 'Pro' ? 'text-yellow-400' : 'text-slate-500'} />
                        حالة الاشتراك
                    </h3>
                    {user.plan === 'Pro' && <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">ACTIVE</span>}
                </div>
                
                <div className="mb-6">
                    <p className="text-sm opacity-80 mb-1">الخطة الحالية</p>
                    <p className="text-3xl font-black">{user.plan} Plan</p>
                </div>

                {user.plan === 'Free' ? (
                    <div className="space-y-4">
                        <ul className="text-sm space-y-2 opacity-70">
                            <li>• 5 برومتات يومياً</li>
                            <li>• سرعة عادية</li>
                            <li>• موديلات أساسية</li>
                        </ul>
                        <button onClick={handleUpgrade} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
                            ترقية إلى Pro ($15)
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                         <ul className="text-sm space-y-2 text-yellow-100">
                            <li>✓ برومتات غير محدودة</li>
                            <li>✓ أولوية قصوى</li>
                            <li>✓ كل الموديلات (Veo, Imagen)</li>
                        </ul>
                        <button className="w-full py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/20">
                            إدارة الاشتراك
                        </button>
                    </div>
                )}
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="text-emerald-500" />
                    الشارات المكتسبة
                </h3>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">مؤسس</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold border border-blue-200">مبدع نشط</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
