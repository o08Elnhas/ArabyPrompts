
import React, { useState } from 'react';
import { Home, Users, BookOpen, Wand2, Star, Heart, TrendingUp, Package, ArrowLeft } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Generator } from './components/Generator';
import { Community } from './components/Community';
import { Learn } from './components/Learn';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AITools } from './components/AITools';
import { User, UserRole, SiteConfig, Section, Service, ContentConfig, PromptStyle, Ad, PromptBundle, PlanType } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Current logged in user
  const [user, setUser] = useState<User | null>(null);

  // MOCK DATABASE for SaaS
  const [allUsers, setAllUsers] = useState<User[]>([
      { 
          id: 'u1', name: 'Admin User', email: 'admin@araby.com', avatar: 'https://ui-avatars.com/api/?name=Admin', role: UserRole.ADMIN, plan: 'Pro', 
          stats: { prompts: 100, likes: 500, followers: 200 }, points: 5000, rankTitle: 'Legend', joinDate: '2023-01-01', lastActive: 'Now'
      },
      { 
          id: 'u2', name: 'Demo User', email: 'user@demo.com', avatar: 'https://ui-avatars.com/api/?name=User', role: UserRole.USER, plan: 'Free',
          stats: { prompts: 5, likes: 10, followers: 0 }, points: 50, rankTitle: 'Novice', joinDate: '2024-02-15', lastActive: 'Yesterday'
      }
  ]);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    name: 'ArabyPrompts',
    description: 'منصة برومتات الفيديو العربية'
  });

  const [contentConfig, setContentConfig] = useState<ContentConfig>({
    heroTitle: 'أطلق العنان لخيالك',
    heroSubtitle: 'المنصة العربية الأولى لتوليد ومشاركة أوصاف الفيديو للذكاء الاصطناعي.'
  });

  const [sections, setSections] = useState<Section[]>([
    { id: 'home', label: 'الرئيسية', icon: Home, isVisible: true },
    { id: 'generator', label: 'توليد برومت', icon: Wand2, isVisible: true },
    { id: 'community', label: 'المجتمع', icon: Users, isVisible: true },
    { id: 'learn', label: 'أكاديمية', icon: BookOpen, isVisible: true },
  ]);

  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Premium Prompt Generation', status: 'Active', price: '$9.99/mo', description: 'Unlimited high-quality prompt generation.' },
    { id: '2', name: 'Video Review Service', status: 'Active', price: '$29.00', description: 'Expert feedback on your AI generated videos.' },
  ]);

  const [styles, setStyles] = useState<PromptStyle[]>([
    { id: 'cinematic', label: 'Cinematic', value: 'cinematic', suffix: 'cinematic lighting, anamorphic lens, 8k, highly detailed' },
    { id: 'anime', label: 'Anime', value: 'anime', suffix: 'studio ghibli style, vibrant colors, cell shaded, 2d animation' },
    { id: '3d-animation', label: '3D Animation', value: '3d', suffix: 'pixar style, unreal engine 5, octane render, disney character' },
    { id: 'cyberpunk', label: 'Cyberpunk', value: 'cyberpunk', suffix: 'neon lights, futuristic city, high tech, rain, reflections' },
  ]);

  const [ads, setAds] = useState<Ad[]>([
      { id: 'ad-1', type: 'banner', label: 'Summer Sale', imageUrl: 'https://picsum.photos/seed/ad1/1200/200', linkUrl: '#', placement: 'below-services', isActive: true },
      { id: 'ad-native-1', type: 'native', label: 'Tool Promo', title: 'Enhance Your Workflow', description: 'Use our new AI tools to fix your prompts instantly.', imageUrl: 'https://picsum.photos/seed/tech/400/300', linkUrl: '#', isActive: true }
  ]);

  const [bundles, setBundles] = useState<PromptBundle[]>([
      { id: 'b1', title: 'Starter Pack', description: 'Essential prompts for beginners', coverImage: 'https://picsum.photos/seed/pack1/300/200', price: 'Free', promptsCount: 15, tags: ['Basic'] },
      { id: 'b2', title: 'Cinematic Master', description: 'Hollywood style shots', coverImage: 'https://picsum.photos/seed/pack2/300/200', price: '$5', promptsCount: 50, tags: ['Pro'] }
  ]);

  // Auth Logic
  const handleLogin = (userData: any) => {
    // Check if user exists in mock DB
    const existingUser = allUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
        setUser(existingUser);
    } else {
        // Register New User (SaaS Logic: Auto Free Plan)
        const newUser: User = {
            id: `u-${Date.now()}`,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            role: userData.email.includes('admin') ? UserRole.ADMIN : UserRole.USER,
            plan: 'Free', // Default plan
            stats: { prompts: 0, likes: 0, followers: 0 },
            points: 0,
            rankTitle: 'Newcomer',
            joinDate: new Date().toLocaleDateString(),
            lastActive: 'Just now'
        };
        setAllUsers([...allUsers, newUser]);
        setUser(newUser);
    }
  };

  const handleLogout = () => {
      setUser(null);
      setCurrentPage('home');
  };

  const AdBanner = ({ placement }: { placement: string }) => {
      const activeAds = ads.filter(ad => ad.isActive && ad.type === 'banner' && ad.placement === placement);
      if (activeAds.length === 0) return null;
      const ad = activeAds[0];
      return (
          <div className="container mx-auto px-4 py-8">
              <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-lg hover:opacity-95 transition-opacity">
                  <img src={ad.imageUrl} alt={ad.label} className="w-full h-32 md:h-48 object-cover" />
              </a>
          </div>
      );
  }

  // Admin View
  if (currentPage === 'admin' && user?.role === UserRole.ADMIN) {
      return (
        <div className="w-full h-screen fixed inset-0 z-50 bg-white">
            <AdminDashboard 
                config={siteConfig}
                sections={sections}
                services={services}
                content={contentConfig}
                styles={styles}
                ads={ads}
                users={allUsers}
                bundles={bundles}
                onUpdateConfig={setSiteConfig}
                onUpdateSections={setSections}
                onUpdateServices={setServices}
                onUpdateContent={setContentConfig}
                onUpdateStyles={setStyles}
                onUpdateAds={setAds}
                onUpdateUsers={setAllUsers}
                onUpdateBundles={setBundles}
                onLogout={handleLogout}
            />
        </div>
      );
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-12 pb-20">
            {/* Hero */}
            <div className="text-center py-20 px-4">
               <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                 {contentConfig.heroTitle}
               </h1>
               <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
                 {contentConfig.heroSubtitle}
               </p>
               <div className="flex justify-center gap-4">
                 <button 
                   onClick={() => setCurrentPage('generator')}
                   className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                 >
                   ابدأ التوليد مجاناً
                 </button>
               </div>
            </div>
            
            {/* Prompt Bundles (New Feature) */}
            <div className="container mx-auto px-4 overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <Package className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">حزم البرومتات المختارة</h2>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
                    {bundles.map(bundle => (
                        <div key={bundle.id} className="min-w-[280px] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all snap-center group cursor-pointer">
                            <div className="h-40 overflow-hidden rounded-t-xl relative">
                                <img src={bundle.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                    {bundle.promptsCount} Prompts
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{bundle.title}</h3>
                                <p className="text-xs text-slate-500 mb-3">{bundle.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-emerald-600">{bundle.price}</span>
                                    <button className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg font-bold">عرض التفاصيل</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AdBanner placement="below-services" />
          </div>
        );
      case 'generator':
        return <Generator styles={styles} />;
      case 'ai-tools':
        return <AITools />;
      case 'community':
        return <Community ads={ads} topUsers={allUsers.sort((a,b) => b.points - a.points)} />;
      case 'learn':
        return <Learn />;
      case 'profile':
        return user ? <Profile user={user} /> : (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">يجب تسجيل الدخول لعرض الملف الشخصي</h2>
                <button onClick={() => setIsAuthModalOpen(true)} className="text-emerald-600 font-bold underline">تسجيل الدخول</button>
            </div>
        );
      default:
        return <div className="text-center py-20 dark:text-white">صفحة غير موجودة</div>;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans" dir="rtl">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        siteName={siteConfig.name}
        navItems={sections}
      />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
}
