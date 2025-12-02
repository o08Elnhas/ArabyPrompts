import React from 'react';
import { Play, Clock, Star, BookOpen, CheckCircle } from 'lucide-react';
import { Course } from '../types';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: "أساسيات كتابة البرومت",
    level: "Beginner",
    duration: "45 دقيقة",
    students: 1245,
    thumbnail: "https://picsum.photos/seed/learn1/600/400",
    progress: 0
  },
  {
    id: '2',
    title: "إتقان حركة الكاميرا والزوايا",
    level: "Intermediate",
    duration: "1.5 ساعة",
    students: 850,
    thumbnail: "https://picsum.photos/seed/learn2/600/400",
    progress: 30
  },
  {
    id: '3',
    title: "الإضاءة السينمائية في AI",
    level: "Advanced",
    duration: "2 ساعة",
    students: 540,
    thumbnail: "https://picsum.photos/seed/learn3/600/400",
    progress: 0
  }
];

export const Learn: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0"></div>
        <div className="relative z-10 text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">أكاديمية ArabyPrompts</h1>
            <p className="text-slate-300 max-w-2xl mb-8">
                تعلم كيف تتحدث لغة الذكاء الاصطناعي. دورات متخصصة تأخذك من الصفر إلى الاحتراف في صناعة الفيديو.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-white/80 bg-white/10 px-4 py-2 rounded-full">
                    <BookOpen className="w-4 h-4" />
                    <span>15+ دورة تدريبية</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 bg-white/10 px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span>شهادات معتمدة</span>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-r-4 border-emerald-500 pr-4">
            المسارات التعليمية المقترحة
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_COURSES.map((course) => (
                <div key={course.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden">
                        <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600">
                                <Play className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white">
                            {course.duration}
                        </div>
                    </div>
                    
                    <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {course.level === 'Beginner' ? 'مبتدئ' : course.level === 'Intermediate' ? 'متوسط' : 'متقدم'}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                4.9
                            </div>
                        </div>
                        
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                            {course.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>{course.students} طالب مسجل</span>
                        </div>

                        {course.progress ? (
                             <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                             </div>
                        ) : (
                            <button className="w-full py-2 mt-2 border border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                ابدأ الآن
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
