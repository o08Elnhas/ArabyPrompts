
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, Layers, Box, Type, Palette,
  Save, Plus, Trash2, Menu, ChevronLeft, ChevronRight,
  Monitor, Globe, Search, ArrowUp, ArrowDown, LogOut, ExternalLink, Megaphone,
  Users, Package, Edit, CheckCircle, XCircle
} from 'lucide-react';
import { SiteConfig, Section, Service, ContentConfig, PromptStyle, Ad, User, PromptBundle, PlanType } from '../types';

interface AdminDashboardProps {
  config: SiteConfig;
  sections: Section[];
  services: Service[];
  content: ContentConfig;
  styles: PromptStyle[];
  ads: Ad[];
  // New props
  users: User[];
  bundles: PromptBundle[];
  
  onUpdateConfig: (cfg: SiteConfig) => void;
  onUpdateSections: (secs: Section[]) => void;
  onUpdateServices: (srvs: Service[]) => void;
  onUpdateContent: (cnt: ContentConfig) => void;
  onUpdateStyles: (styles: PromptStyle[]) => void;
  onUpdateAds: (ads: Ad[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateBundles: (bundles: PromptBundle[]) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config, sections, services, content, styles, ads, users, bundles,
  onUpdateConfig, onUpdateSections, onUpdateServices, onUpdateContent, onUpdateStyles, onUpdateAds, onUpdateUsers, onUpdateBundles, onLogout
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Handlers ---
  const updateItemInArray = <T extends { id: string }>(
    items: T[],
    id: string,
    field: keyof T,
    value: any,
    updateFn: (items: T[]) => void
  ) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    updateFn(updatedItems);
  };

  const deleteItem = <T extends { id: string }>(
    items: T[],
    id: string,
    updateFn: (items: T[]) => void
  ) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      updateFn(items.filter(item => item.id !== id));
    }
  };

  // Section Handlers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    onUpdateSections(newSections);
  };

  // Service, Style, Ad Handlers (Previous impl + Native Ads)
  const addNewAd = () => {
    const newAd: Ad = {
        id: `ad-${Date.now()}`,
        type: 'banner',
        label: 'New Campaign',
        imageUrl: 'https://via.placeholder.com/1200x200',
        linkUrl: '#',
        placement: 'below-services',
        isActive: false,
        title: '',
        description: ''
    };
    onUpdateAds([...ads, newAd]);
  };

  const addNewService = () => {
    const newSvc: Service = {
      id: Date.now().toString(),
      name: 'New Service',
      price: '$0.00',
      status: 'Inactive',
      description: 'Description here...'
    };
    onUpdateServices([...services, newSvc]);
  };

  const addNewStyle = () => {
    const newStl: PromptStyle = {
      id: `style-${Date.now()}`,
      label: 'New Style',
      value: 'new-style',
      suffix: 'artistic style'
    };
    onUpdateStyles([...styles, newStl]);
  };

  // Bundle Handler
  const addNewBundle = () => {
    const newBundle: PromptBundle = {
        id: `bundle-${Date.now()}`,
        title: 'New Bundle',
        description: 'Bundle description',
        coverImage: 'https://via.placeholder.com/300x200',
        price: 'Free',
        promptsCount: 10,
        tags: []
    };
    onUpdateBundles([...bundles, newBundle]);
  };

  // User Handlers
  const toggleUserPlan = (userId: string, currentPlan: PlanType) => {
      const newPlan = currentPlan === 'Free' ? 'Pro' : 'Free';
      updateItemInArray<User>(users, userId, 'plan', newPlan, onUpdateUsers);
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${
        activeTab === id 
        ? 'bg-slate-800 text-emerald-400 border-emerald-500' 
        : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
      }`}
      title={isSidebarCollapsed ? label : ''}
    >
      <Icon className="w-5 h-5 min-w-[20px]" />
      {!isSidebarCollapsed && <span>{label}</span>}
    </button>
  );

  // --- Renderers ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Control Center</h1>
          <p className="text-slate-500">Real-time management dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Pro Members', value: users.filter(u => u.plan === 'Pro').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Active Ads', value: ads.filter(a => a.isActive).length, icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Bundles', value: bundles.length, icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsersManager = () => (
      <div className="space-y-6 animate-in fade-in">
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500">User</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Email</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Current Plan</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Join Date</th>
                            <th className="p-4 text-xs font-bold uppercase text-slate-500">Actions (Override)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={user.avatar} className="w-8 h-8 rounded-full" />
                                    <span className="font-bold">{user.name}</span>
                                </td>
                                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.plan === 'Pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {user.plan}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">{user.joinDate || 'N/A'}</td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => toggleUserPlan(user.id, user.plan)}
                                        className="text-xs font-bold text-blue-600 hover:underline"
                                    >
                                        Switch to {user.plan === 'Free' ? 'Pro' : 'Free'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
      </div>
  );

  const renderBundlesManager = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Prompt Bundles</h2>
            <button onClick={addNewBundle} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4" /> Create Bundle
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundles.map(bundle => (
                <div key={bundle.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4">
                    <img src={bundle.coverImage} className="w-24 h-24 object-cover rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-2">
                        <input 
                            value={bundle.title}
                            onChange={(e) => updateItemInArray<PromptBundle>(bundles, bundle.id, 'title', e.target.value, onUpdateBundles)}
                            className="font-bold text-lg w-full outline-none hover:bg-slate-50 rounded"
                            placeholder="Bundle Title"
                        />
                        <input 
                            value={bundle.description}
                            onChange={(e) => updateItemInArray<PromptBundle>(bundles, bundle.id, 'description', e.target.value, onUpdateBundles)}
                            className="text-sm text-slate-500 w-full outline-none hover:bg-slate-50 rounded"
                            placeholder="Description"
                        />
                         <div className="flex gap-2">
                            <input 
                                value={bundle.price}
                                onChange={(e) => updateItemInArray<PromptBundle>(bundles, bundle.id, 'price', e.target.value, onUpdateBundles)}
                                className="text-xs font-bold text-emerald-600 w-20 outline-none hover:bg-slate-50 rounded"
                                placeholder="Price"
                            />
                             <button onClick={() => deleteItem(bundles, bundle.id, onUpdateBundles)} className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderAdsManager = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Ads System (Banners & Native)</h2>
            <button onClick={addNewAd} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors">
                <Plus className="w-4 h-4" /> Add Ad
            </button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                             <th className="p-4 text-xs font-bold uppercase text-slate-500">Type</th>
                             <th className="p-4 text-xs font-bold uppercase text-slate-500 w-32">Placement</th>
                             <th className="p-4 text-xs font-bold uppercase text-slate-500">Content (Title/Desc/Img)</th>
                             <th className="p-4 text-xs font-bold uppercase text-slate-500">Link</th>
                             <th className="p-4 text-xs font-bold uppercase text-slate-500">Status</th>
                             <th className="p-4 text-xs font-bold uppercase text-slate-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {ads.map(ad => (
                            <tr key={ad.id} className="hover:bg-slate-50/50">
                                <td className="p-2 align-top">
                                    <select
                                        value={ad.type}
                                        onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'type', e.target.value, onUpdateAds)}
                                        className="p-2 border rounded bg-white text-xs w-24"
                                    >
                                        <option value="banner">Banner</option>
                                        <option value="native">Native Card</option>
                                    </select>
                                </td>
                                <td className="p-2 align-top">
                                    {ad.type === 'banner' ? (
                                        <select
                                            value={ad.placement}
                                            onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'placement', e.target.value, onUpdateAds)}
                                            className="p-2 border rounded bg-white text-xs w-full"
                                        >
                                            <option value="below-services">Below Services</option>
                                            <option value="below-best-prompts">Below Best</option>
                                            <option value="footer">Footer</option>
                                        </select>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic p-2 block">In Feed</span>
                                    )}
                                </td>
                                <td className="p-2 space-y-2">
                                    <input 
                                        value={ad.label}
                                        onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'label', e.target.value, onUpdateAds)}
                                        className="w-full p-1 border rounded text-xs font-bold"
                                        placeholder="Internal Label"
                                    />
                                    {ad.type === 'native' && (
                                        <>
                                            <input 
                                                value={ad.title}
                                                onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'title', e.target.value, onUpdateAds)}
                                                className="w-full p-1 border rounded text-xs"
                                                placeholder="Public Title"
                                            />
                                            <input 
                                                value={ad.description}
                                                onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'description', e.target.value, onUpdateAds)}
                                                className="w-full p-1 border rounded text-xs"
                                                placeholder="Description"
                                            />
                                        </>
                                    )}
                                    <input 
                                        value={ad.imageUrl}
                                        onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'imageUrl', e.target.value, onUpdateAds)}
                                        className="w-full p-1 border rounded text-xs font-mono text-slate-500"
                                        placeholder="Image URL"
                                    />
                                </td>
                                <td className="p-2 align-top">
                                     <input 
                                        value={ad.linkUrl}
                                        onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'linkUrl', e.target.value, onUpdateAds)}
                                        className="w-full p-1 border rounded text-xs text-blue-600"
                                        placeholder="https://..."
                                    />
                                </td>
                                <td className="p-4 align-top">
                                    <input 
                                        type="checkbox"
                                        checked={ad.isActive}
                                        onChange={(e) => updateItemInArray<Ad>(ads, ad.id, 'isActive', e.target.checked, onUpdateAds)}
                                        className="w-5 h-5 accent-orange-500"
                                    />
                                </td>
                                <td className="p-2 text-center align-top">
                                    <button onClick={() => deleteItem(ads, ad.id, onUpdateAds)} className="p-2 text-red-400 hover:bg-red-50 rounded">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  // --- Main Layout ---
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans" dir="ltr">
      <aside 
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shadow-2xl z-20 relative`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!isSidebarCollapsed && (
             <div className="font-black text-xl text-white tracking-tight">ARABY<span className="text-emerald-500">.ADMIN</span></div>
          )}
          {isSidebarCollapsed && <div className="w-full flex justify-center text-emerald-500 font-bold">A.A</div>}
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
          >
            {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          
          <div className="px-4 py-2 mt-4 mb-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
             {!isSidebarCollapsed ? 'SaaS Management' : '-'}
          </div>
          <SidebarItem id="users" icon={Users} label="Users & Plans" />
          <SidebarItem id="bundles" icon={Package} label="Prompt Bundles" />
          <SidebarItem id="ads" icon={Megaphone} label="Ad Campaigns" />

          <div className="px-4 py-2 mt-4 mb-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
             {!isSidebarCollapsed ? 'Site Config' : '-'}
          </div>
          <SidebarItem id="general" icon={Settings} label="General Settings" />
          <SidebarItem id="sections" icon={Layers} label="Sections" />
          <SidebarItem id="services" icon={Box} label="Services" />
          <SidebarItem id="styles" icon={Palette} label="Styles" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-3 px-4 py-3 rounded-lg text-sm font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all`}>
            <LogOut className="w-5 h-5" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-100">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-4 text-slate-500 text-sm">
             <span>Admin Panel</span>
             <span className="text-slate-300">/</span>
             <span className="font-bold text-slate-800 capitalize">{activeTab}</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 pb-20 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsersManager()}
            {activeTab === 'bundles' && renderBundlesManager()}
            {activeTab === 'ads' && renderAdsManager()}
            {activeTab === 'general' && (
                <div className="text-slate-500">Settings Manager (Same as previous)</div> 
            )}
            {activeTab === 'sections' && (
                <div className="text-slate-500">Section Manager (Same as previous)</div>
            )}
            {activeTab === 'services' && (
                <div className="text-slate-500">Service Manager (Same as previous)</div>
            )}
            {activeTab === 'styles' && (
                <div className="text-slate-500">Style Manager (Same as previous)</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
