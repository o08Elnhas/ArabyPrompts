
import React from 'react';
import { LogIn, Settings, Wrench } from 'lucide-react';
import { User as UserType, UserRole, Section } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: UserType | null;
  onLoginClick: () => void;
  siteName: string;
  navItems: Section[];
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  user, 
  onLoginClick,
  siteName,
  navItems
}) => {
  const visibleItems = navItems.filter(item => item.isVisible);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-xl font-bold bg-gradient-to-l from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {siteName}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </button>
          ))}
          {/* Static Link for Tools if not in dynamic sections */}
          <button
            onClick={() => onNavigate('ai-tools')}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              currentPage === 'ai-tools'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
            }`}
          >
            <Wrench className="w-4 h-4" />
            أدوات AI
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === UserRole.ADMIN && (
             <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                currentPage === 'admin' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          )}

          {user ? (
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
                {user.name}
              </span>
              {user.role === 'PRO' && <span className="bg-emerald-500 text-white text-[10px] px-1.5 rounded-full font-bold">PRO</span>}
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-sm font-bold"
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden flex justify-around border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2">
        {visibleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'text-emerald-600'
                  : 'text-slate-500'
              }`}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
          <button
              onClick={() => onNavigate('ai-tools')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === 'ai-tools'
                  ? 'text-emerald-600'
                  : 'text-slate-500'
              }`}
            >
              <Wrench className="w-5 h-5" />
              <span className="text-[10px]">أدوات</span>
            </button>
      </div>
    </nav>
  );
};
