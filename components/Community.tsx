
import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, TrendingUp, Trophy, Send, ExternalLink, Zap } from 'lucide-react';
import { PromptPost, UserRole, Ad, User } from '../types';

// Extended props to accept ads and top users
interface CommunityProps {
  ads: Ad[];
  topUsers: User[];
}

const MOCK_POSTS: PromptPost[] = [
  {
    id: '1',
    title: 'المدينة العائمة في السحاب',
    description: 'Cinematic wide shot, a futuristic city floating above golden clouds, golden hour lighting, 8k resolution, highly detailed.',
    author: { 
        id: 'u1', name: 'أحمد محمد', email: 'a@a.com', avatar: 'https://picsum.photos/seed/u1/100/100', role: UserRole.PRO, 
        plan: 'Pro', stats: { prompts: 10, likes: 50, followers: 100 }, points: 1250, rankTitle: 'Master', joinDate: '', lastActive: ''
    },
    likes: 234,
    views: 1200,
    tags: ['Sci-Fi', 'Clouds', 'City'],
    imageUrl: 'https://picsum.photos/seed/cloudcity/800/450',
    createdAt: 'منذ ساعتين',
    category: 'Cinematic',
    comments: [
      {
        id: 'c1',
        user: { id: 'u3', name: 'كريم حسن', email: 'k@k.com', avatar: 'https://picsum.photos/seed/u3/100/100', role: UserRole.USER, plan: 'Free', stats: { prompts: 2, likes: 10, followers: 5 }, points: 100, rankTitle: 'Novice', joinDate: '', lastActive: '' },
        text: 'وصف رائع جداً! هل جربت استخدامه مع Midjourney؟',
        createdAt: 'منذ ساعة'
      }
    ]
  },
  {
    id: '2',
    title: 'سباق سيارات سايبر بانك',
    description: 'Cyberpunk style, neon lights reflection on wet asphalt, high speed car chase, motion blur, rain drops.',
    author: { id: 'u2', name: 'سارة علي', email: 's@s.com', avatar: 'https://picsum.photos/seed/u2/100/100', role: UserRole.USER, plan: 'Free', stats: { prompts: 5, likes: 20, followers: 10 }, points: 450, rankTitle: 'Creator', joinDate: '', lastActive: '' },
    likes: 156,
    views: 890,
    tags: ['Cyberpunk', 'Cars', 'Neon'],
    imageUrl: 'https://picsum.photos/seed/cyber/800/450',
    createdAt: 'منذ 5 ساعات',
    category: 'Cyberpunk',
    comments: []
  },
  // Adding more mock posts to demonstrate ad injection
  {
    id: '3',
    title: 'غابة مسحورة قديمة',
    description: 'Fantasy forest, glowing mushrooms, fairy lights, mist, macro shot of a magical flower opening, 4k.',
    author: { id: 'u3', name: 'كريم حسن', email: 'k@k.com', avatar: 'https://picsum.photos/seed/u3/100/100', role: UserRole.USER, plan: 'Free', stats: { prompts: 2, likes: 10, followers: 5 }, points: 100, rankTitle: 'Novice', joinDate: '', lastActive: '' },
    likes: 89,
    views: 450,
    tags: ['Nature', 'Fantasy', 'Magic'],
    imageUrl: 'https://picsum.photos/seed/forest/800/450',
    createdAt: 'منذ يوم',
    category: 'Realistic',
    comments: []
  },
  { id: '4', title: 'بورتريه فني', description: 'Oil painting style, portrait of an old man.', author: { id: 'u1', name: 'أحمد', email: '', avatar: 'https://picsum.photos/seed/u1/100/100', role: UserRole.USER, plan: 'Free', stats: {prompts:0,likes:0,followers:0}, points: 10, rankTitle: 'New', joinDate: '', lastActive: '' }, likes: 45, views: 200, tags: [], imageUrl: 'https://picsum.photos/seed/p4/800/450', createdAt: '2d', category: 'Realistic' },
  { id: '5', title: 'فضاء خارجي', description: 'Deep space, nebula, stars.', author: { id: 'u2', name: 'سارة', email: '', avatar: 'https://picsum.photos/seed/u2/100/100', role: UserRole.USER, plan: 'Free', stats: {prompts:0,likes:0,followers:0}, points: 10, rankTitle: 'New', joinDate: '', lastActive: '' }, likes: 112, views: 500, tags: [], imageUrl: 'https://picsum.photos/seed/p5/800/450', createdAt: '3d', category: 'Cinematic' },
  { id: '6', title: 'روبوت مستقبلي', description: '3D render of a cute robot.', author: { id: 'u3', name: 'كريم', email: '', avatar: 'https://picsum.photos/seed/u3/100/100', role: UserRole.USER, plan: 'Free', stats: {prompts:0,likes:0,followers:0}, points: 10, rankTitle: 'New', joinDate: '', lastActive: '' }, likes: 67, views: 300, tags: [], imageUrl: 'https://picsum.photos/seed/p6/800/450', createdAt: '3d', category: '3D' },
  { id: '7', title: 'غروب الشمس', description: 'Sunset at the beach.', author: { id: 'u1', name: 'أحمد', email: '', avatar: 'https://picsum.photos/seed/u1/100/100', role: UserRole.USER, plan: 'Free', stats: {prompts:0,likes:0,followers:0}, points: 10, rankTitle: 'New', joinDate: '', lastActive: '' }, likes: 88, views: 400, tags: [], imageUrl: 'https://picsum.photos/seed/p7/800/450', createdAt: '4d', category: 'Realistic' },
];

export const Community: React.FC<CommunityProps> = ({ ads = [], topUsers = [] }) => {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const toggleComments = (postId: string) => {
    if (activePostId === postId) {
      setActivePostId(null);
    } else {
      setActivePostId(postId);
    }
  };

  const handleInputChange = (postId: string, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  // Logic to inject Native Ads every 6th post
  const getFeedItems = () => {
    const items: (PromptPost | Ad)[] = [];
    const nativeAds = ads.filter(ad => ad.type === 'native' && ad.isActive);
    let adIndex = 0;

    MOCK_POSTS.forEach((post, index) => {
        items.push(post);
        // Inject ad after every 6 posts (index 5, 11, etc.)
        if ((index + 1) % 6 === 0 && nativeAds.length > 0) {
            items.push(nativeAds[adIndex % nativeAds.length]);
            adIndex++;
        }
    });
    return items;
  };

  const feedItems = getFeedItems();

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <TrendingUp className="text-emerald-500" />
          مجتمع المبدعين
        </h2>
        <p className="text-slate-600 dark:text-slate-400">استكشف أفضل الإبداعات وشارك أعمالك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {feedItems.map((item) => {
              // Check if it's an Ad
              if ('type' in item) {
                  const ad = item as Ad;
                  return (
                    <div key={ad.id} className="bg-slate-900/5 dark:bg-white/5 border border-amber-200 dark:border-amber-900/30 rounded-2xl overflow-hidden shadow-sm relative">
                        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                            إعلان ممول (Sponsored)
                        </div>
                        <div className="flex flex-col md:flex-row">
                             <div className="md:w-1/3 aspect-video md:aspect-auto">
                                 <img src={ad.imageUrl} alt={ad.label} className="w-full h-full object-cover" />
                             </div>
                             <div className="p-6 md:w-2/3 flex flex-col justify-center">
                                 <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{ad.title || ad.label}</h4>
                                 <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{ad.description}</p>
                                 <a href={ad.linkUrl} target="_blank" rel="noopener" className="self-start flex items-center gap-2 text-emerald-600 font-bold text-sm hover:underline">
                                     زيارة الموقع <ExternalLink className="w-3 h-3" />
                                 </a>
                             </div>
                        </div>
                    </div>
                  );
              }

              // It's a Post
              const post = item as PromptPost;
              return (
                <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                <div className="relative aspect-video">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/20">
                    {post.category}
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700" />
                        <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white">{post.author.name}</h4>
                            {post.author.plan === 'Pro' && <span className="bg-emerald-500 text-white text-[10px] px-1.5 rounded-full font-bold">PRO</span>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{post.createdAt}</p>
                        </div>
                    </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
                    <p className="text-sm font-mono text-slate-600 dark:text-slate-300 line-clamp-2" dir="ltr">
                        {post.description}
                    </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">{post.likes}</span>
                        </button>
                        <button 
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-1 transition-colors ${activePostId === post.id ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500'}`}
                        >
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                        </button>
                    </div>
                    <button className="text-slate-500 hover:text-emerald-500 transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                    </div>

                    {/* Comments Section */}
                    {activePostId === post.id && (
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">التعليقات</h4>
                        
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                <img src={comment.user.avatar} className="w-8 h-8 rounded-full" alt={comment.user.name} />
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-2xl rounded-tr-none flex-1">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">{comment.user.name}</span>
                                        <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{comment.text}</p>
                                </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm text-slate-500 py-4">لا توجد تعليقات بعد.</p>
                        )}
                        </div>
                    
                        <div className="flex gap-3 items-center">
                        <input 
                            type="text" 
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleInputChange(post.id, e.target.value)}
                            placeholder="أكتب تعليقاً..."
                            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                        />
                        <button className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                            <Send className="w-4 h-4" />
                        </button>
                        </div>
                    </div>
                    )}
                </div>
                </div>
              );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            {/* Gamification Leaderboard */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 sticky top-24">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    أفضل المساهمين (Top Ranked)
                </h3>
                <div className="space-y-4">
                    {topUsers.slice(0, 5).map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={user.avatar} className="w-10 h-10 rounded-full" alt="User" />
                                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white dark:border-slate-800 ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-orange-700' : 'bg-slate-600'}`}>
                                        {index + 1}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                                        {user.name}
                                        {user.plan === 'Pro' && <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />}
                                    </p>
                                    <p className="text-xs text-slate-500">{user.points} نقطة • {user.rankTitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
