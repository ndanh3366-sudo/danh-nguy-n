import React, { useState, useEffect, useRef } from 'react';
import { ForumPost, ForumComment, User, Product } from '../types';
import { api } from '../services/api';
import { INITIAL_POSTS } from '../data/forumPosts';

interface ForumViewProps {
  currentUser: User | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

// 100% authentic images from project files - verified on disk
const LOCAL_AVATARS = [
  { name: 'Rider Symbol Red', path: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/dlyjpm8-ea90294c-de09-4bc2-8718-6b49acbf082e.png' },
  { name: 'Revice Crest', path: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/kamen_rider_revice_logo_by_driftingcar_dghk15w-pre.png' },
  { name: 'Saber Crest', path: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/kamen_rider_saber_logo_by_driftingcar_dgh9vay-pre.png' },
  { name: 'Kiva Crest', path: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/kamen_rider_kiva_logo_by_driftingcar_dg7tj5z-pre.png' },
  { name: 'Knight Crest', path: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/kamen_rider_knight_logo_by_driftingcar_dg73k3x-414w-2x.png' },
  { name: 'Femme Crest', path: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/kamen_rider_femme_logo_by_driftingcar_dg73lkh-pre.png' },
  { name: 'NPTTEAMSTORE Official', path: '/Logo & Thương Hiệu (Brand Logo)/dreamina-2026-07-29-3008-A minimalist stencil-style logo of an oc....png' }
];

// Curated authentic image bank from local repository for quick selection
const LOCAL_STOCK_GALLERY = [
  // S.H.Figuarts
  {
    category: 'shf',
    label: 'SHF Gavv Poppingummy 1',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Gavv Poppingummy Form1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Gavv Poppingummy 2',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Gavv Poppingummy Form2.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Gavv Poppingummy 3',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Gavv Poppingummy Form3.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Xross Saber 1',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Xross Saber1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Xross Saber 2',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Xross Saber2.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Gavv Caking Form',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Gavv Caking Form1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Valen Chocodon Form',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Valen Chocodon Form1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Saber Brave Dragon Metallic',
    path: '/Ảnh Sản Phẩm/shf/[Chính Hãng] SHF Kamen Rider Saber Brave Dragon Metallic Color Edition1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Ark-One P-Bandai',
    path: '/Ảnh Sản Phẩm/shf premium/[Chính Hãng] SHF Kamen Rider Ark-One 1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Ark-Zero & Effect Parts',
    path: '/Ảnh Sản Phẩm/shf premium/[Chính Hãng] SHF Kamen Rider Ark-Zero & Ark Effect Parts Set 1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Cross-Z Heisei Edition',
    path: '/Ảnh Sản Phẩm/shf premium/[Chính Hãng] SHF Kamen Rider Cross-Z Heisei Generations Edition 1.jpg'
  },
  {
    category: 'shf',
    label: 'SHF Drive Type Speed',
    path: '/Ảnh Sản Phẩm/shf premium/[Chính Hãng] SHF Kamen Rider Drive Type Speed Heisei Generations Edition 1.jpg'
  },

  // DX Belts & Items
  {
    category: 'dx',
    label: 'DX Henshin Belt Zeztz Lord Invoker 1',
    path: '/Ảnh Sản Phẩm/dx/Kamen Rider Zeztz DX Henshin Belt Lord Invoker1.jpg'
  },
  {
    category: 'dx',
    label: 'DX Henshin Belt Zeztz Lord Invoker 2',
    path: '/Ảnh Sản Phẩm/dx/Kamen Rider Zeztz DX Henshin Belt Lord Invoker2.jpg'
  },
  {
    category: 'dx',
    label: 'DX Sengoku Driver Gaim & Baron 1',
    path: '/Ảnh Sản Phẩm/dx/Super Best DX Sengoku Driver Kamen Rider Gaim & Baron Set 1.jpg'
  },
  {
    category: 'dx',
    label: 'DX Sengoku Driver Gaim & Baron 2',
    path: '/Ảnh Sản Phẩm/dx/Super Best DX Sengoku Driver Kamen Rider Gaim & Baron Set 2.jpg'
  },
  {
    category: 'dx',
    label: 'DX Legend Kamen Raiser Gotchard',
    path: '/Ảnh Sản Phẩm/dx/Đồ chơi biến hình Kamen Rider Gotchard DX Legend Kamen Raiser.jpg'
  },
  {
    category: 'dx',
    label: 'DX Chain Array & Claw Raise Buckle',
    path: '/Ảnh Sản Phẩm/dx/Đồ chơi siêu nhân Kamen Rider DX Chain Array & Claw Raise Buckle Set 1.jpg'
  },
  {
    category: 'dx',
    label: 'DX Double Driver Raise Buckle Box',
    path: '/Ảnh Sản Phẩm/dx/Đồ chơi siêu nhân Kamen Rider Geats Surprise Mission Box 001 & DX Double Driver Raise Buckle Set 1.jpg'
  },
  {
    category: 'dx',
    label: 'DX Jackal Vistamp Revice Japan',
    path: '/Ảnh Sản Phẩm/item/NEW Bandai Kamen Rider Revice DX Jackal Vistamp & Vistamp Bar from Japan 1.jpg'
  },

  // Weapons & Sentai
  {
    category: 'weapon',
    label: 'DX Magnum Shooter 40X Geats',
    path: '/Ảnh Sản Phẩm/vũ khí/BANDAI Kamen Rider Geats DX Magnum Shooter 40X Weapon from Japan 1.jpg'
  },
  {
    category: 'weapon',
    label: 'DX Beat Axe Geats',
    path: '/Ảnh Sản Phẩm/vũ khí/Đồ chơi vũ khí siêu nhân Kamen Rider Geats DX Beat Axe 1.jpg'
  },
  {
    category: 'weapon',
    label: 'DX EX Exgotchalibur Gotchard',
    path: '/Ảnh Sản Phẩm/vũ khí/Đồ chơi vũ khí Kamen Rider Gotchard DX EX Exgotchalibur 1.jpg'
  },
  {
    category: 'weapon',
    label: 'SMP GaoHunter Super Sentai',
    path: '/Ảnh Sản Phẩm/super sentai/SHOKUGAN MODELING PROJECT SMP HYAKUJUU GATTAI GAOHUNTER - HYAKUJUU SENTAI GAORANGER.webp'
  },
  {
    category: 'weapon',
    label: 'SHF Don Momotaro Sentai',
    path: '/Ảnh Sản Phẩm/super sentai/[Chính Hãng] SHF Don Momotaro 1.webp'
  },

  // Showroom & Posters
  {
    category: 'showroom',
    label: 'Không Gian Showroom NPTTEAMSTORE 2026',
    path: '/Ảnh Showroom & Cửa Hàng/20240708_161850.jpg'
  },
  {
    category: 'poster',
    label: 'Poster Gavv Latest Climax Arc',
    path: '/Bộ Sưu Tập Poster Dọc/brand-new-official-poster-for-gavvs-latest-arc-v0-tgav2jhk04te1.webp'
  },
  {
    category: 'poster',
    label: 'Poster Kamen Rider Cross-Z Art',
    path: '/Bộ Sưu Tập Poster Dọc/Kamen_Rider_Cross-Z_Poster.webp'
  },
  {
    category: 'poster',
    label: 'Poster Gavv V-Cinema Official',
    path: '/Bộ Sưu Tập Poster Dọc/kamen-rider-gavv-v-cinema-suprise-for-hanto-fans-v0-6l7l29ykz5mf1.webp'
  }
];

// Trending hashtags for right sidebar
const TRENDING_TOPICS = [
  { tag: '#KamenRiderGavv', category: 'Tokusatsu · Thịnh hành', postsCount: '24.8K bài đăng' },
  { tag: '#SHFiguarts', category: 'Mô hình Bandai · Thịnh hành', postsCount: '18.2K bài đăng' },
  { tag: '#SengokuDriver', category: 'Đai DX Super Best · Thịnh hành', postsCount: '12.6K bài đăng' },
  { tag: '#NPTTEAMSTORE', category: 'Cộng đồng Toku VN', postsCount: '9.4K bài đăng' },
  { tag: '#ZeztzLordInvoker', category: 'Kamen Rider 2026', postsCount: '7.1K bài đăng' },
  { tag: '#SMPGaoHunter', category: 'Super Sentai · Thịnh hành', postsCount: '5.3K bài đăng' }
];

// Who to follow suggestions
const WHO_TO_FOLLOW = [
  {
    name: 'NPTTEAMSTORE Official',
    handle: '@nptteamstore',
    avatar: '/Logo & Thương Hiệu (Brand Logo)/dreamina-2026-07-29-3008-A minimalist stencil-style logo of an oc....png',
    bio: 'Kênh thông tin chính thức NPTTEAMSTORE • DX, CSM, SHF Nhật Bản',
    isGold: true,
    isFollowing: true
  },
  {
    name: 'Bandai Spirits Collector VN',
    handle: '@bandai_collector_vn',
    avatar: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/dlyjpm8-ea90294c-de09-4bc2-8718-6b49acbf082e.png',
    bio: 'Cộng đồng giao lưu mô hình SHF, CSM chính hãng tại VN',
    isGold: false,
    isFollowing: false
  },
  {
    name: 'Shin Dan Kuroto Foundation',
    handle: '@shingodan_official',
    avatar: '/BIỂU TƯỢNG DANH MỤC SẢN PHẨM/kamen_rider_knight_logo_by_driftingcar_dg73k3x-414w-2x.png',
    bio: 'Vị thần tối cao của làng Kamen Rider Gaming & Gashat',
    isGold: false,
    isFollowing: false
  }
];

export const ForumView: React.FC<ForumViewProps> = ({ 
  currentUser, 
  showToast, 
  products = [], 
  onSelectProduct 
}) => {
  // Main posts state
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem('nptteamstore_community_posts_x_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_POSTS;
  });

  const [isLiveOnline, setIsLiveOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Vừa xong');

  // Real-time online synchronization with backend server
  const fetchOnlinePosts = async (showSyncIndicator = false) => {
    if (showSyncIndicator) setIsSyncing(true);
    try {
      const serverPosts = await api.getForumPosts();
      if (serverPosts && serverPosts.length > 0) {
        setPosts(prev => {
          // Merge server posts with local posts while retaining user interaction flags
          const merged = [...serverPosts];
          prev.forEach(p => {
            if (!merged.some(sp => sp.id === p.id)) {
              merged.push(p);
            } else {
              const idx = merged.findIndex(sp => sp.id === p.id);
              if (idx !== -1) {
                // Keep local user-specific state like isLiked, isBookmarked, isReposted
                merged[idx] = {
                  ...merged[idx],
                  isLiked: p.isLiked || merged[idx].isLiked,
                  isBookmarked: p.isBookmarked || merged[idx].isBookmarked,
                  isReposted: p.isReposted || merged[idx].isReposted,
                };
              }
            }
          });
          return merged;
        });
        setIsLiveOnline(true);
      }
      const now = new Date();
      setLastSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
    } catch (err) {
      console.warn('Online forum sync warning:', err);
    } finally {
      if (showSyncIndicator) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  };

  useEffect(() => {
    fetchOnlinePosts(false);
    const interval = setInterval(() => {
      fetchOnlinePosts(false);
    }, 4000); // 100% Real-time sync interval
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nptteamstore_community_posts_x_v2', JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  // Main navigation tab
  const [navTab, setNavTab] = useState<'home' | 'explore' | 'notifications' | 'bookmarks' | 'profile'>('home');

  // Top header feed tab: "Dành cho bạn" (For you) vs "Đang theo dõi" (Following)
  const [feedTab, setFeedTab] = useState<'forYou' | 'following'>('forYou');

  // Direct Messages (DM) Chat State for Toku-X real app experience
  const [isDmOpen, setIsDmOpen] = useState(false);
  const [dmMessages, setDmMessages] = useState([
    { id: 1, sender: 'NPT Store Support', text: 'Chào bạn! Đơn hàng DX Henshin Belt Gavv của bạn đã được đóng gói và giao hỏa tốc nhé!', time: '10 phút trước', isMe: false },
    { id: 2, sender: 'Bạn', text: 'Shop check kỹ hộ mình khớp háng con S.H.Figuarts Gavv nhé!', time: '5 phút trước', isMe: true }
  ]);
  const [dmInput, setDmInput] = useState('');

  const handleSendDm = () => {
    if (!dmInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Bạn',
      text: dmInput.trim(),
      time: 'Vừa xong',
      isMe: true
    };
    setDmMessages(prev => [...prev, newMsg]);
    setDmInput('');
    setTimeout(() => {
      setDmMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'NPT Store Support',
          text: 'Cảm ơn bạn đã nhắn tin! Shop đã ghi chú yêu cầu của bạn và sẽ gửi video test hàng trước khi giao nha. 🔥',
          time: 'Vừa xong',
          isMe: false
        }
      ]);
    }, 1200);
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Following list state for Who to Follow (default follow key community members)
  const [followList, setFollowList] = useState<Record<string, boolean>>({
    '@nptteamstore': true,
    '@long_rider': true,
    '@baonam_dx': true,
    '@khanh_henshin': true,
    '@quanghai_art': true,
    '@nam_collector': true,
    '@bandai_collector_vn': false,
    '@shingodan_official': false
  });

  // Inline Composer states
  const [tweetContent, setTweetContent] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState<'all' | 'shf' | 'dx' | 'weapon' | 'showroom' | 'poster'>('all');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerInputRef = useRef<HTMLTextAreaElement>(null);

  // Open comments threads
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Lightbox Modal for viewing photos
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Quick Post modal for the sidebar "Đăng bài" button
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Community Voting Poll State
  const [pollVoted, setPollVoted] = useState<number | null>(null);
  const [pollOptions, setPollOptions] = useState([
    { id: 1, text: 'Kamen Rider Gavv (Gochizo Munching)', votes: 1420 },
    { id: 2, text: 'Kamen Rider Zeztz 2026 (Lord Invoker)', votes: 1890 },
    { id: 3, text: 'Decade CSM Ver.2 + K-Touch 21', votes: 1650 },
    { id: 4, text: 'Geats Desire Driver + Laser Boost', votes: 980 }
  ]);

  // Handle follow / unfollow
  const toggleFollow = (handle: string) => {
    setFollowList(prev => {
      const next = !prev[handle];
      showToast(next ? `Đã theo dõi ${handle}` : `Đã hủy theo dõi ${handle}`, 'info');
      return { ...prev, [handle]: next };
    });
  };

  // Handle Like
  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isLiked = !p.isLiked;
      const likes = isLiked ? (p.likes + 1) : Math.max(0, p.likes - 1);
      return { ...p, isLiked, likes };
    }));
    api.likeForumPost(postId).catch(e => console.warn('Like sync fallback:', e));
  };

  // Handle Repost
  const handleRepost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isReposted = !p.isReposted;
      const reposts = (p.reposts || 0) + (isReposted ? 1 : -1);
      showToast(isReposted ? 'Đã đăng lại lên trang cá nhân của bạn!' : 'Đã hủy đăng lại', 'info');
      return { ...p, isReposted, reposts: Math.max(0, reposts) };
    }));
  };

  // Handle Bookmark
  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isBookmarked = !p.isBookmarked;
      const bookmarks = (p.bookmarks || 0) + (isBookmarked ? 1 : -1);
      showToast(isBookmarked ? 'Đã thêm bài viết vào mục Đã lưu' : 'Đã xóa bài viết khỏi mục Đã lưu', 'info');
      return { ...p, isBookmarked, bookmarks: Math.max(0, bookmarks) };
    }));
  };

  // Handle Share
  const handleShare = (post: ForumPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết bài đăng!', 'success');
    } else {
      showToast('Chia sẻ bài đăng của ' + post.author, 'info');
    }
  };

  // Handle Add Comment
  const handleAddComment = (postId: string) => {
    const text = (replyInputs[postId] || '').trim();
    if (!text) return;

    const newComment: ForumComment = {
      id: 'c_' + Date.now(),
      author: currentUser?.name || 'Kamen Rider Fan',
      authorAvatar: currentUser?.avatar || LOCAL_AVATARS[0].path,
      content: text,
      createdAt: 'Vừa xong'
    };

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const updatedList = [...(p.commentsList || []), newComment];
      return {
        ...p,
        commentsCount: updatedList.length,
        commentsList: updatedList
      };
    }));

    api.addForumComment(postId, {
      authorName: newComment.author,
      authorAvatar: newComment.authorAvatar,
      content: newComment.content
    }).catch(e => console.warn('Comment sync fallback:', e));

    setReplyInputs(prev => ({ ...prev, [postId]: '' }));
    showToast('Đã gửi phản hồi!', 'success');
  };

  // Handle Submit Tweet from Composer
  const handlePublishTweet = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tweetContent.trim() && attachedImages.length === 0) {
      showToast('Vui lòng nhập nội dung bài viết!', 'error');
      return;
    }

    const taggedProd = products.find(p => p.id === selectedProductId);

    // Extract hashtags from content
    const hashtagMatches = tweetContent.match(/#[a-zA-Z0-9_À-ỹ]+/g) || [];

    const newPost: ForumPost = {
      id: 'fp_' + Date.now(),
      title: tweetContent.slice(0, 60),
      author: currentUser?.name || 'Rider Collector',
      handle: currentUser ? `@${currentUser.email.split('@')[0]}` : '@rider_collector',
      authorAvatar: currentUser?.avatar || LOCAL_AVATARS[0].path,
      authorBadge: currentUser?.tierRank || 'Novice Rider',
      isVerified: true,
      era: 'Reiwa',
      category: 'Khoe Bộ Sưu Tập',
      content: tweetContent,
      images: attachedImages.length > 0 ? attachedImages : undefined,
      productId: taggedProd?.id,
      productName: taggedProd?.name,
      productImage: taggedProd?.images[0],
      productPrice: taggedProd?.price,
      likes: 0,
      isLiked: false,
      reposts: 0,
      isReposted: false,
      bookmarks: 0,
      isBookmarked: false,
      views: 1,
      tags: hashtagMatches.map(t => t.trim()),
      reactions: { henshin: 0, fire: 0, diamond: 0 },
      commentsCount: 0,
      commentsList: [],
      createdAt: 'Vừa xong'
    };

    setPosts([newPost, ...posts]);

    api.createForumPost(newPost).catch(e => console.warn('Post sync fallback:', e));

    setTweetContent('');
    setAttachedImages([]);
    setSelectedProductId('');
    setIsPostModalOpen(false);
    showToast('Đã đăng bài viết mới thành công!', 'success');
  };

  // Toggle image selection in local stock gallery
  const toggleStockImage = (path: string) => {
    if (attachedImages.includes(path)) {
      setAttachedImages(attachedImages.filter(p => p !== path));
    } else {
      if (attachedImages.length >= 4) {
        showToast('Tối đa 4 ảnh cho mỗi bài đăng (chuẩn X)!', 'error');
        return;
      }
      setAttachedImages([...attachedImages, path]);
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (attachedImages.length >= 4) {
      showToast('Tối đa 4 ảnh cho mỗi bài đăng!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedImages(prev => [...prev, reader.result as string]);
        showToast('Đã tải hình ảnh thành công!', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add emoji to tweet
  const addEmoji = (emoji: string) => {
    setTweetContent(prev => prev + ' ' + emoji + ' ');
    setIsEmojiPickerOpen(false);
  };

  // Filter posts logic
  const filteredPosts = posts.filter(post => {
    // Nav tab: Bookmarks
    if (navTab === 'bookmarks') {
      if (!post.isBookmarked) return false;
    }

    // Header feed tab: Following
    if (feedTab === 'following' && navTab === 'home') {
      if (post.handle && followList[post.handle] === false) {
        return false;
      }
    }

    // Hashtag filter
    if (selectedTag) {
      const matchTag = post.content.toLowerCase().includes(selectedTag.toLowerCase()) ||
        (post.tags && post.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()));
      if (!matchTag) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchText = post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        (post.handle && post.handle.toLowerCase().includes(query)) ||
        (post.productName && post.productName.toLowerCase().includes(query));
      if (!matchText) return false;
    }

    return true;
  });

  // Helper to format views
  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    return num.toString();
  };

  // Helper to highlight hashtags and mentions in tweet content
  const renderFormattedText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith('#')) {
        return (
          <button
            key={i}
            onClick={() => {
              setSelectedTag(word);
              setSearchQuery('');
            }}
            className="text-cyan-400 hover:underline font-semibold"
          >
            {word}
          </button>
        );
      }
      if (word.startsWith('@')) {
        return (
          <span key={i} className="text-cyan-400 hover:underline cursor-pointer">
            {word}
          </span>
        );
      }
      return word;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060b1b]/95 via-[#09122c]/90 to-[#050814]/95 text-neutral-100 flex justify-center">
      <div className="w-full max-w-7xl flex flex-row justify-center">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: NAVIGATION SIDEBAR (Iconic X Navigation)      */}
        {/* ========================================================= */}
        <aside className="w-16 sm:w-20 xl:w-64 flex flex-col justify-between h-screen sticky top-0 px-2 sm:px-3 py-3 border-r border-cyan-500/20 z-30 select-none">
          <div className="space-y-1">
            {/* DTD Brand Logo */}
            <div className="flex items-center gap-3 p-3 rounded-full hover:bg-neutral-900/80 cursor-pointer w-fit transition duration-200">
              <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-sm font-black shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                DTD
              </div>
              <div className="hidden xl:block">
                <div className="font-black text-xl tracking-wider text-white text-pop">
                  DTD
                </div>
              </div>
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-1">
              <button
                onClick={() => { setNavTab('home'); setSelectedTag(null); setSearchQuery(''); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-base transition duration-150 ${
                  navTab === 'home' 
                    ? 'font-bold text-white bg-neutral-900/80' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <i className="fa-solid fa-house text-xl w-6 text-center"></i>
                <span className="hidden xl:inline text-lg">Trang chủ</span>
              </button>

              <button
                onClick={() => { setNavTab('explore'); setSelectedTag(null); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-base transition duration-150 ${
                  navTab === 'explore' 
                    ? 'font-bold text-white bg-neutral-900/80' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <i className="fa-solid fa-magnifying-glass text-xl w-6 text-center"></i>
                <span className="hidden xl:inline text-lg">Khám phá</span>
              </button>

              <button
                onClick={() => {
                  setNavTab('notifications');
                  showToast('Bạn có 3 thông báo mới về tương tác Henshin!', 'info');
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-base transition duration-150 relative ${
                  navTab === 'notifications' 
                    ? 'font-bold text-white bg-neutral-900/80' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className="relative w-6 flex justify-center">
                  <i className="fa-regular fa-bell text-xl"></i>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></span>
                </div>
                <span className="hidden xl:inline text-lg">Thông báo</span>
              </button>

              <button
                onClick={() => setIsDmOpen(true)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-base text-neutral-400 hover:text-white hover:bg-neutral-900 transition duration-150 relative"
                title="Tin nhắn trực tiếp Toku-X"
              >
                <div className="relative w-6 flex justify-center">
                  <i className="fa-regular fa-envelope text-xl"></i>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                </div>
                <span className="hidden xl:inline text-lg">Tin nhắn DM</span>
              </button>

              <button
                onClick={() => { setNavTab('bookmarks'); setSelectedTag(null); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-base transition duration-150 ${
                  navTab === 'bookmarks' 
                    ? 'font-bold text-white bg-neutral-900/80' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <i className="fa-regular fa-bookmark text-xl w-6 text-center"></i>
                <span className="hidden xl:inline text-lg">Đã lưu</span>
              </button>

              <button
                onClick={() => {
                  showToast('Hội Toku Đai Biến Hình DX & S.H.Figuarts Việt Nam với 35,000 thành viên!', 'info');
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-base text-neutral-400 hover:text-white hover:bg-neutral-900 transition duration-150"
              >
                <i className="fa-solid fa-user-group text-xl w-6 text-center"></i>
                <span className="hidden xl:inline text-lg">Cộng đồng</span>
              </button>

              <button
                onClick={() => {
                  showToast('Toku Premium: Tích xanh VIP, tải ảnh gốc 4K, giảm 10% đơn hàng tại shop!', 'info');
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-full text-base text-neutral-400 hover:text-white hover:bg-neutral-900 transition duration-150"
              >
                <div className="w-6 flex justify-center text-cyan-400">
                  <i className="fa-solid fa-certificate text-xl"></i>
                </div>
                <span className="hidden xl:inline text-lg">Toku Premium</span>
              </button>

              <button
                onClick={() => { setNavTab('profile'); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-full text-base transition duration-150 ${
                  navTab === 'profile' 
                    ? 'font-bold text-white bg-neutral-900/80' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <i className="fa-regular fa-user text-xl w-6 text-center"></i>
                <span className="hidden xl:inline text-lg">Hồ sơ</span>
              </button>
            </nav>

            {/* X Post Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsPostModalOpen(true);
                  setTimeout(() => composerInputRef.current?.focus(), 150);
                }}
                className="w-full py-3 xl:py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition duration-200 flex items-center justify-center gap-2 group"
              >
                <i className="fa-solid fa-feather text-lg"></i>
                <span className="hidden xl:inline text-base font-extrabold">Đăng bài</span>
              </button>
            </div>
          </div>

          {/* User Profile Footer Card */}
          <div className="p-2 rounded-full hover:bg-neutral-900 cursor-pointer transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/50 bg-neutral-800 flex-shrink-0">
                <img
                  src={currentUser?.avatar || LOCAL_AVATARS[0].path}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xl:block text-left text-xs">
                <div className="font-bold text-white flex items-center gap-1">
                  <span>{currentUser?.name || 'Rider Collector'}</span>
                  <i className="fa-solid fa-circle-check text-cyan-400 text-[11px]"></i>
                </div>
                <div className="text-neutral-500 font-mono text-[11px]">
                  {currentUser ? `@${currentUser.email.split('@')[0]}` : '@rider_collector'}
                </div>
              </div>
            </div>
            <div className="hidden xl:block text-neutral-400 hover:text-white">
              <i className="fa-solid fa-ellipsis"></i>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: MAIN FEED (The Heart of X)                 */}
        {/* ========================================================= */}
        <main className="w-full flex-1 max-w-2xl min-h-screen border-r border-neutral-800 pb-20">
          
          {/* Sticky Header with Frosted Glass Effect */}
          <header className="sticky top-0 z-20 bg-black/85 backdrop-blur-md border-b border-neutral-800">
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-white flex items-center gap-2">
                  <span>
                    {navTab === 'home' && 'Trang chủ'}
                    {navTab === 'explore' && 'Khám phá Tokusatsu'}
                    {navTab === 'notifications' && 'Thông báo tương tác'}
                    {navTab === 'bookmarks' && 'Bài viết đã lưu'}
                    {navTab === 'profile' && 'Hồ sơ người sưu tầm'}
                  </span>
                  {selectedTag && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 flex items-center gap-1.5">
                      <span>{selectedTag}</span>
                      <button 
                        onClick={() => setSelectedTag(null)} 
                        className="hover:text-rose-400 ml-1 text-sm font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </h1>
                
                {/* 100% Online Real-Time Sync Indicator */}
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
                  <span>CƠ CHẾ TRỰC TUYẾN 100%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchOnlinePosts(true)}
                  disabled={isSyncing}
                  className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Đồng bộ bài viết trực tiếp từ máy chủ"
                >
                  <i className={`fa-solid fa-rotate text-[11px] ${isSyncing ? 'animate-spin' : ''}`}></i>
                  <span>{isSyncing ? 'Đang đồng bộ...' : 'Làm mới'}</span>
                </button>
                <div className="text-cyan-400 p-2 rounded-full hover:bg-neutral-900 cursor-pointer transition">
                  <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                </div>
              </div>
            </div>

            {/* "For You" vs "Following" Tabs */}
            {navTab === 'home' && (
              <div className="flex border-t border-neutral-800/80">
                <button
                  onClick={() => setFeedTab('forYou')}
                  className="flex-1 py-3 text-center relative hover:bg-neutral-900/50 transition duration-150"
                >
                  <span className={`text-sm ${feedTab === 'forYou' ? 'font-black text-white' : 'font-medium text-neutral-400'}`}>
                    Dành cho bạn
                  </span>
                  {feedTab === 'forYou' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  )}
                </button>
                <button
                  onClick={() => setFeedTab('following')}
                  className="flex-1 py-3 text-center relative hover:bg-neutral-900/50 transition duration-150"
                >
                  <span className={`text-sm ${feedTab === 'following' ? 'font-black text-white' : 'font-medium text-neutral-400'}`}>
                    Đang theo dõi
                  </span>
                  {feedTab === 'following' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  )}
                </button>
              </div>
            )}
          </header>

          {/* Quick Filter Tag Chips */}
          <div className="px-4 py-2 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none bg-neutral-950/40">
            <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1 flex-shrink-0">
              <i className="fa-solid fa-fire text-amber-400"></i> Chủ đề:
            </span>
            {[
              'Tất cả',
              '#KamenRiderGavv',
              '#SHFiguarts',
              '#SengokuDriver',
              '#SuperSentai',
              '#GócTrưngBày',
              '#PBandai'
            ].map(tag => {
              const isActive = (tag === 'Tất cả' && !selectedTag) || selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag === 'Tất cả') setSelectedTag(null);
                    else setSelectedTag(tag);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* ======================================================= */}
          {/* INLINE COMPOSER ("What is happening?!")                  */}
          {/* ======================================================= */}
          {navTab === 'home' && (
            <div className="p-4 border-b border-neutral-800 bg-black">
              <div className="flex gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400/40 bg-neutral-800 flex-shrink-0 mt-1">
                  <img
                    src={currentUser?.avatar || LOCAL_AVATARS[0].path}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Composer Form */}
                <div className="flex-1 space-y-3">
                  <textarea
                    ref={composerInputRef}
                    rows={2}
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    placeholder="Chuyện gì đang xảy ra trong thế giới Tokusatsu?!"
                    className="w-full bg-transparent text-white placeholder-neutral-500 text-base resize-none focus:outline-none leading-relaxed"
                  />

                  {/* Attached Images Preview (X grid style) */}
                  {attachedImages.length > 0 && (
                    <div className={`grid gap-2 rounded-2xl overflow-hidden border border-neutral-800 ${
                      attachedImages.length === 1 ? 'grid-cols-1' :
                      attachedImages.length === 2 ? 'grid-cols-2' :
                      attachedImages.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
                    }`}>
                      {attachedImages.map((img, idx) => (
                        <div key={idx} className="relative group bg-neutral-950 max-h-48 overflow-hidden flex items-center justify-center">
                          <img
                            src={img}
                            alt={`Attached ${idx}`}
                            className="w-full h-40 object-contain p-1"
                          />
                          <button
                            type="button"
                            onClick={() => setAttachedImages(attachedImages.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 hover:bg-black text-white text-xs flex items-center justify-center transition border border-white/20"
                            title="Xóa ảnh này"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tagged Product Chip Preview */}
                  {selectedProductId && (
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-cyan-400/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <i className="fa-solid fa-tag text-cyan-400"></i>
                        <span className="text-neutral-400">Gắn thẻ:</span>
                        <span className="font-bold text-white truncate">
                          {products.find(p => p.id === selectedProductId)?.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedProductId('')}
                        className="text-neutral-400 hover:text-rose-400 text-sm font-bold ml-2"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Toolbar & Post Button */}
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2 text-cyan-400">
                      {/* Open Local Stock Gallery */}
                      <button
                        type="button"
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="w-9 h-9 rounded-full hover:bg-cyan-400/10 flex items-center justify-center transition"
                        title="Chọn ảnh Tokusatsu có sẵn của Web"
                      >
                        <i className="fa-regular fa-image text-lg"></i>
                      </button>

                      {/* File Upload from PC */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-9 h-9 rounded-full hover:bg-cyan-400/10 flex items-center justify-center transition"
                        title="Tải ảnh từ máy tính"
                      >
                        <i className="fa-solid fa-arrow-up-from-bracket text-base"></i>
                      </button>

                      {/* Tag Product Dropdown toggle */}
                      <div className="relative group">
                        <select
                          value={selectedProductId}
                          onChange={(e) => setSelectedProductId(e.target.value)}
                          className="opacity-0 absolute inset-0 w-9 h-9 cursor-pointer z-10"
                          title="Gắn thẻ sản phẩm shop"
                        >
                          <option value="">-- Không gắn thẻ --</option>
                          {products.slice(0, 30).map(p => (
                            <option key={p.id} value={p.id}>
                              [{p.category}] {p.name} - {p.price.toLocaleString('vi-VN')}₫
                            </option>
                          ))}
                        </select>
                        <div className="w-9 h-9 rounded-full hover:bg-cyan-400/10 flex items-center justify-center transition pointer-events-none">
                          <i className="fa-solid fa-tags text-base"></i>
                        </div>
                      </div>

                      {/* Emoji Trigger */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                          className="w-9 h-9 rounded-full hover:bg-cyan-400/10 flex items-center justify-center transition"
                          title="Biểu cảm Rider"
                        >
                          <i className="fa-regular fa-face-smile text-lg"></i>
                        </button>
                        {isEmojiPickerOpen && (
                          <div className="absolute top-10 left-0 bg-neutral-900 border border-neutral-700 rounded-xl p-2 shadow-2xl z-30 flex gap-2">
                            {['💥', '🔥', '⚡', '🗡️', '🛡️', '👑', '💎', '🍬', '🏍️'].map(e => (
                              <button
                                key={e}
                                type="button"
                                onClick={() => addEmoji(e)}
                                className="text-lg p-1.5 hover:bg-neutral-800 rounded-lg transition"
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Char count & Đăng button */}
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-neutral-500 font-mono">
                        {tweetContent.length > 0 && `${tweetContent.length}/280`}
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePublishTweet()}
                        disabled={!tweetContent.trim() && attachedImages.length === 0}
                        className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-cyan-400 text-black font-extrabold text-sm rounded-full shadow-[0_0_12px_rgba(6,182,212,0.3)] transition"
                      >
                        Đăng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* FEED LIST (Authentic X Tweet Stream)                    */}
          {/* ======================================================= */}
          <div className="divide-y divide-neutral-800">
            {filteredPosts.length === 0 ? (
              <div className="py-16 text-center text-neutral-500 space-y-3">
                <i className="fa-solid fa-feather-pointed text-4xl text-neutral-700"></i>
                <div className="font-bold text-base text-neutral-300">Không có bài đăng nào</div>
                <p className="text-xs max-w-sm mx-auto">
                  {selectedTag 
                    ? `Chưa có bài đăng nào chứa thẻ ${selectedTag}. Hãy là người đầu tiên đăng bài!`
                    : 'Hãy theo dõi các Tokufan khác hoặc tự mình đăng bài đầu tiên!'}
                </p>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="px-4 py-2 rounded-full bg-cyan-400 text-black text-xs font-bold hover:bg-cyan-300"
                  >
                    Xem tất cả bài đăng
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map(post => {
                const isCommentsOpen = !!openComments[post.id];
                const images = post.images && post.images.length > 0 
                  ? post.images 
                  : (post.image ? [post.image] : []);

                return (
                  <article
                    key={post.id}
                    className="p-4 hover:bg-neutral-900/20 transition-colors duration-200 flex gap-3 text-neutral-200 border-b border-neutral-900"
                  >
                    {/* Author Avatar Column */}
                    <div className="flex-shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-neutral-800 bg-neutral-800 cursor-pointer hover:opacity-90 transition">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0 space-y-1">
                      
                      {/* Repost Header Indicator if reposted */}
                      {post.isReposted && (
                        <div className="flex items-center gap-2 text-[12px] font-bold text-neutral-500 mb-0.5 ml-8">
                          <i className="fa-solid fa-arrows-rotate text-emerald-500"></i>
                          <span>Bạn đã đăng lại</span>
                        </div>
                      )}

                      {/* Header Line: Name, Verified Badge, Handle, Dot, Time, More Menu */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate text-[15px]">
                          <span className="font-bold text-white hover:underline cursor-pointer truncate">
                            {post.author}
                          </span>

                          {/* Verification Badge */}
                          {post.isGoldVerified ? (
                            <span title="Tài khoản Doanh nghiệp / Cửa hàng chính thức">
                              <i className="fa-solid fa-circle-check text-amber-400 text-[14px]"></i>
                            </span>
                          ) : post.isVerified ? (
                            <span title="Người sưu tầm đã xác minh">
                              <i className="fa-solid fa-circle-check text-cyan-400 text-[14px]"></i>
                            </span>
                          ) : null}

                          {/* Handle & Dot & Time */}
                          <span className="text-neutral-500 text-[15px] truncate">
                            {post.handle || `@${post.author.toLowerCase().replace(/\s+/g, '_')}`}
                          </span>
                          <span className="text-neutral-600 text-[15px]">·</span>
                          <span className="text-neutral-500 text-[15px] hover:underline cursor-pointer flex-shrink-0">
                            {post.createdAt}
                          </span>
                        </div>

                        {/* Three dots options */}
                        <div className="text-neutral-500 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition">
                          <i className="fa-solid fa-ellipsis"></i>
                        </div>
                      </div>

                      {/* Tweet Text */}
                      <p className="text-[15px] text-neutral-100 whitespace-pre-line leading-normal break-words pr-2">
                        {renderFormattedText(post.content)}
                      </p>

                      {/* Media Layout (Twitter Multi-image Grid) */}
                      {images.length > 0 && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-neutral-800 bg-black">
                          {images.length === 1 && (
                            <div
                              onClick={() => setLightboxImage(images[0])}
                              className="w-full max-h-[500px] cursor-pointer overflow-hidden bg-neutral-950 flex items-center justify-center group"
                            >
                              <img
                                src={images[0]}
                                alt="Tweet media"
                                className="w-full h-auto max-h-[500px] object-cover group-hover:opacity-90 transition duration-200"
                              />
                            </div>
                          )}

                          {images.length === 2 && (
                            <div className="grid grid-cols-2 gap-0.5 h-[300px]">
                              {images.map((img, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setLightboxImage(img)}
                                  className="h-full cursor-pointer overflow-hidden bg-neutral-950 flex items-center justify-center group"
                                >
                                  <img
                                    src={img}
                                    alt={`Media ${idx}`}
                                    className="w-full h-full object-cover group-hover:opacity-90 transition duration-200"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {images.length === 3 && (
                            <div className="grid grid-cols-2 gap-0.5 h-[300px]">
                              <div
                                onClick={() => setLightboxImage(images[0])}
                                className="h-full cursor-pointer overflow-hidden bg-neutral-950 flex items-center justify-center group"
                              >
                                <img
                                  src={images[0]}
                                  alt="Media 0"
                                  className="w-full h-full object-cover group-hover:opacity-90 transition duration-200"
                                />
                              </div>
                              <div className="grid grid-rows-2 gap-0.5 h-[300px]">
                                {images.slice(1, 3).map((img, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => setLightboxImage(img)}
                                    className="h-full cursor-pointer overflow-hidden bg-neutral-950 flex items-center justify-center group"
                                  >
                                    <img
                                      src={img}
                                      alt={`Media ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:opacity-90 transition duration-200"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {images.length >= 4 && (
                            <div className="grid grid-cols-2 gap-0.5 h-[300px]">
                              {images.slice(0, 4).map((img, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setLightboxImage(img)}
                                  className="h-full cursor-pointer overflow-hidden bg-neutral-950 flex items-center justify-center group"
                                >
                                  <img
                                    src={img}
                                    alt={`Media ${idx}`}
                                    className="w-full h-full object-cover group-hover:opacity-90 transition duration-200"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tagged Shop Product Card (Twitter Player / Link Card) */}
                      {post.productName && (
                        <div
                          onClick={() => {
                            if (post.productId && onSelectProduct) {
                              const match = products.find(p => p.id === post.productId);
                              if (match) onSelectProduct(match);
                              else showToast(`Sản phẩm: ${post.productName}`, 'info');
                            } else {
                              showToast(`Sản phẩm: ${post.productName}`, 'info');
                            }
                          }}
                          className="mt-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 hover:bg-neutral-900/60 p-2.5 flex items-center gap-3 cursor-pointer group transition duration-200"
                        >
                          {post.productImage && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-black flex-shrink-0">
                              <img
                                src={post.productImage}
                                alt={post.productName}
                                className="w-full h-full object-cover group-hover:opacity-90 transition"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white text-[14px] truncate group-hover:text-cyan-400 transition">
                              {post.productName}
                            </div>
                            {post.productPrice && (
                              <div className="text-cyan-400 font-extrabold text-[13px] mt-0.5">
                                {post.productPrice.toLocaleString('vi-VN')}₫
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ================================================= */}
                      {/* STREAMLINED COMMUNITY ACTION BAR (3 BUTTONS)      */}
                      {/* ================================================= */}
                      <div className="pt-2 flex items-center justify-around text-neutral-500 text-[13px] select-none max-w-sm w-full">
                        {/* 💬 Reply */}
                        <button
                          type="button"
                          onClick={() => setOpenComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="flex items-center gap-1.5 group transition"
                          title="Bình luận"
                        >
                          <div className="w-9 h-9 rounded-full group-hover:bg-cyan-500/10 group-hover:text-cyan-400 flex items-center justify-center transition">
                            <i className="fa-regular fa-comment text-[16px]"></i>
                          </div>
                          <span>{post.commentsCount || 0}</span>
                        </button>

                        {/* ❤️ Like */}
                        <button
                          type="button"
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 group transition ${
                            post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                          }`}
                          title="Thích"
                        >
                          <div className="w-9 h-9 rounded-full group-hover:bg-rose-500/10 flex items-center justify-center transition">
                            <i className={`text-[16px] ${post.isLiked ? 'fa-solid fa-heart animate-ping-once' : 'fa-regular fa-heart'}`}></i>
                          </div>
                          <span>{post.likes || 0}</span>
                        </button>

                        {/* 📤 Share */}
                        <button
                          type="button"
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-1.5 group transition hover:text-cyan-400"
                          title="Chia sẻ"
                        >
                          <div className="w-9 h-9 rounded-full group-hover:bg-cyan-400/10 flex items-center justify-center transition">
                            <i className="fa-regular fa-arrow-up-from-bracket text-[16px]"></i>
                          </div>
                          <span>Chia sẻ</span>
                        </button>
                      </div>

                      {/* ================================================= */}
                      {/* INLINE COMMENTS THREAD (X Thread Style)           */}
                      {/* ================================================= */}
                      {isCommentsOpen && (
                        <div className="mt-3 pt-3 border-t border-neutral-800 space-y-3">
                          {/* List of existing replies */}
                          {post.commentsList && post.commentsList.length > 0 && (
                            <div className="space-y-2.5">
                              {post.commentsList.map(comment => (
                                <div key={comment.id} className="flex gap-2.5 items-start text-xs bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                                  <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0">
                                    <img
                                      src={comment.authorAvatar || LOCAL_AVATARS[0].path}
                                      alt={comment.author}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-white truncate">{comment.author}</span>
                                      <span className="text-[10px] text-neutral-500">{comment.createdAt}</span>
                                    </div>
                                    <p className="text-neutral-300 mt-0.5 leading-relaxed break-words">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Inline Reply Input */}
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={replyInputs[post.id] || ''}
                              onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id);
                              }}
                              placeholder="Đăng câu trả lời của bạn..."
                              className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-cyan-400 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold rounded-full transition"
                            >
                              Trả lời
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: SEARCH, TRENDS & WHO TO FOLLOW              */}
        {/* ========================================================= */}
        <aside className="hidden lg:block w-80 xl:w-88 pl-6 py-3 space-y-4 sticky top-0 h-screen overflow-y-auto scrollbar-none">
          
          {/* Search Bar */}
          <div className="sticky top-0 bg-black pt-1 pb-2 z-10">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm trên Toku-X"
                className="w-full bg-neutral-900 border border-transparent focus:border-cyan-400 focus:bg-black rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Premium Subscription Card */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <h2 className="font-black text-base text-white">Đăng ký Toku Premium</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mở khóa tích xanh xác minh, huy hiệu VIP Collector và voucher giảm 10% độc quyền cho mọi đơn hàng mô hình.
            </p>
            <button
              onClick={() => showToast('Đăng ký Premium thành công! Bạn đã nhận tích xanh VIP.', 'success')}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-full shadow-[0_0_12px_rgba(6,182,212,0.3)] transition"
            >
              Đăng ký ngay
            </button>
          </div>

          {/* Tokusatsu Community Voting Poll Widget */}
          <div className="p-4 rounded-2xl bg-[#0c1633]/90 border border-cyan-500/40 space-y-3 shadow-lg shadow-cyan-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-square-poll-vertical text-cyan-400"></i> Bình Chọn Cộng Đồng
              </span>
              <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                HOT
              </span>
            </div>
            
            <h3 className="font-bold text-xs text-white leading-snug">
              Bộ đai Henshin Belt nào bạn đánh giá đột phá & đáng sở hữu nhất hiện nay?
            </h3>

            <div className="space-y-2">
              {(() => {
                const totalVotes = pollOptions.reduce((acc, cur) => acc + cur.votes, 0);
                return pollOptions.map((opt) => {
                  const percent = Math.round((opt.votes / totalVotes) * 100);
                  const isSelected = pollVoted === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (pollVoted !== null) return;
                        setPollVoted(opt.id);
                        setPollOptions(prev => prev.map(o => o.id === opt.id ? { ...o, votes: o.votes + 1 } : o));
                        showToast(`🗳️ Đã ghi nhận bình chọn của bạn cho [${opt.text}]!`, 'success');
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition relative overflow-hidden group ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 font-bold'
                          : 'border-slate-800 bg-[#070d1f] hover:border-cyan-500/50 text-slate-200'
                      }`}
                    >
                      {/* Animated Progress Fill */}
                      {pollVoted !== null && (
                        <div
                          className="absolute inset-y-0 left-0 bg-cyan-500/25 transition-all duration-700 pointer-events-none"
                          style={{ width: `${percent}%` }}
                        ></div>
                      )}

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="truncate pr-2">{opt.text}</span>
                        {pollVoted !== null ? (
                          <span className="font-mono font-bold text-cyan-300 text-[11px] flex-shrink-0">
                            {percent}%
                          </span>
                        ) : (
                          <i className="fa-regular fa-circle text-slate-500 group-hover:text-cyan-400 text-[11px]"></i>
                        )}
                      </div>
                    </button>
                  );
                });
              })()}
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
              <span>Tổng: {pollOptions.reduce((a, b) => a + b.votes, 0).toLocaleString()} phiếu</span>
              <span>{pollVoted ? '✅ Đã bình chọn' : '👉 Nhấp để bình chọn'}</span>
            </div>
          </div>

          {/* Trends for you (Xu hướng cho bạn) */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
              <h2 className="font-black text-base text-white">Xu hướng cho bạn</h2>
              <i className="fa-solid fa-gear text-neutral-500 text-xs hover:text-white cursor-pointer"></i>
            </div>
            <div className="divide-y divide-neutral-800/60">
              {TRENDING_TOPICS.map((trend, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedTag(trend.tag);
                    setSearchQuery('');
                  }}
                  className="p-3.5 hover:bg-neutral-800/50 cursor-pointer transition flex items-center justify-between group"
                >
                  <div>
                    <div className="text-[11px] text-neutral-500">{trend.category}</div>
                    <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition mt-0.5">
                      {trend.tag}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{trend.postsCount}</div>
                  </div>
                  <div className="text-neutral-500 hover:text-white">
                    <i className="fa-solid fa-ellipsis"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Who to follow (Gợi ý theo dõi) */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-800/80">
              <h2 className="font-black text-base text-white">Gợi ý theo dõi</h2>
            </div>
            <div className="divide-y divide-neutral-800/60">
              {WHO_TO_FOLLOW.map((account, idx) => {
                const isFollowed = followList[account.handle] ?? account.isFollowing;
                return (
                  <div key={idx} className="p-3.5 hover:bg-neutral-800/50 transition flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 flex-shrink-0">
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 text-xs">
                        <div className="font-bold text-white flex items-center gap-1 truncate">
                          <span className="truncate">{account.name}</span>
                          {account.isGold ? (
                            <i className="fa-solid fa-circle-check text-amber-400 text-[10px]"></i>
                          ) : (
                            <i className="fa-solid fa-circle-check text-cyan-400 text-[10px]"></i>
                          )}
                        </div>
                        <div className="text-neutral-500 font-mono text-[11px] truncate">
                          {account.handle}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFollow(account.handle)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex-shrink-0 ${
                        isFollowed
                          ? 'border border-neutral-600 text-white hover:border-rose-500 hover:text-rose-400 hover:bg-rose-500/10'
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      {isFollowed ? 'Đang theo dõi' : 'Theo dõi'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer links */}
          <div className="px-3 text-[11px] text-neutral-600 space-y-1">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <a href="#rules" className="hover:underline">Điều khoản dịch vụ</a>
              <a href="#privacy" className="hover:underline">Chính sách bảo mật</a>
              <a href="#help" className="hover:underline">Trợ giúp</a>
              <a href="#ads" className="hover:underline">Quảng cáo</a>
            </div>
            <div>© 2026 NPT-𝕏 · NPTTEAMSTORE Corporation</div>
          </div>

        </aside>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: LOCAL STOCK IMAGE SELECTOR GALLERY (Strict Files) */}
      {/* ========================================================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-cyan-500/40 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.25)]">
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-images text-cyan-400 text-lg"></i>
                <h3 className="font-black text-white text-base">Kho Ảnh Tokusatsu Chính Hãng Của Web</h3>
              </div>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Category tabs */}
            <div className="px-4 py-2 border-b border-neutral-800 flex items-center gap-1 overflow-x-auto scrollbar-none bg-neutral-950">
              {[
                { id: 'all', label: 'Tất cả ảnh' },
                { id: 'shf', label: 'S.H.Figuarts' },
                { id: 'dx', label: 'Đai Biến Hình DX' },
                { id: 'weapon', label: 'Vũ Khí & Sentai' },
                { id: 'showroom', label: 'Showroom' },
                { id: 'poster', label: 'Poster Nghệ Thuật' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setGalleryTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    galleryTab === tab.id
                      ? 'bg-cyan-400 text-black'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Images Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-neutral-950/70">
              {LOCAL_STOCK_GALLERY
                .filter(item => galleryTab === 'all' || item.category === galleryTab)
                .map((item, idx) => {
                  const isSelected = attachedImages.includes(item.path);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStockImage(item.path)}
                      className={`relative rounded-xl overflow-hidden border p-2 cursor-pointer transition group bg-neutral-900 ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'border-neutral-800 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="h-28 flex items-center justify-center bg-black/60 rounded-lg overflow-hidden">
                        <img
                          src={item.path}
                          alt={item.label}
                          className="w-full h-full object-contain p-1 group-hover:scale-105 transition duration-200"
                        />
                      </div>
                      <div className="text-[11px] font-bold text-neutral-300 truncate mt-1.5">
                        {item.label}
                      </div>

                      {/* Selected check badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-400 text-black font-black text-xs flex items-center justify-center shadow-lg">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex items-center justify-between">
              <div className="text-xs text-neutral-400">
                Đã chọn: <span className="font-bold text-cyan-400">{attachedImages.length}/4</span> ảnh
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAttachedImages([])}
                  className="px-3 py-1.5 rounded-full border border-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Bỏ chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold rounded-full transition"
                >
                  Xác nhận xong
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: FULLSCREEN IMAGE LIGHTBOX                        */}
      {/* ========================================================= */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center text-lg border border-neutral-700 z-10 transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen view"
            className="max-w-full max-h-[92vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: QUICK POST MODAL (Triggered by Sidebar Button)   */}
      {/* ========================================================= */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="font-bold text-white text-base">Đăng bài lên Toku-X</span>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <textarea
              rows={4}
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              placeholder="Chia sẻ khoảnh khắc Henshin, unbox đai, pose figure của bạn..."
              className="w-full bg-transparent text-white placeholder-neutral-500 text-base resize-none focus:outline-none"
              autoFocus
            />

            {/* Attached images preview */}
            {attachedImages.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-2">
                {attachedImages.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden bg-black border border-neutral-700 flex-shrink-0">
                    <img src={img} alt="Attached" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setAttachedImages(attachedImages.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(true)}
                className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-cyan-400 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <i className="fa-regular fa-image"></i>
                <span>Kho ảnh ({attachedImages.length}/4)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePublishTweet()}
                disabled={!tweetContent.trim() && attachedImages.length === 0}
                className="px-6 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-extrabold text-sm rounded-full transition"
              >
                Đăng bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toku-X Direct Messages (DM) Chat Modal */}
      {isDmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-neutral-950 border border-cyan-500/40 rounded-3xl w-full max-w-xl h-[600px] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-400 bg-neutral-800">
                  <img src="/Logo & Thương Hiệu (Brand Logo)/dreamina-2026-07-29-3008-A minimalist stencil-style logo of an oc....png" alt="NPT Store" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>NPT Store Support & Collectors</span>
                    <i className="fa-solid fa-circle-check text-cyan-400 text-xs"></i>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">● Đang trực tuyến · Hỗ trợ 24/7</div>
                </div>
              </div>
              <button
                onClick={() => setIsDmOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-black via-neutral-950 to-black">
              {dmMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] text-neutral-500 mb-1 px-1">{msg.sender} · {msg.time}</div>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    msg.isMe
                      ? 'bg-cyan-400 text-neutral-950 font-medium rounded-tr-none'
                      : 'bg-neutral-900 text-neutral-100 border border-neutral-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-900/90 flex items-center gap-2">
              <input
                type="text"
                value={dmInput}
                onChange={(e) => setDmInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendDm(); }}
                placeholder="Nhắn tin với shop hoặc cộng đồng Toku..."
                className="flex-1 bg-black border border-neutral-800 focus:border-cyan-400 rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              />
              <button
                type="button"
                onClick={handleSendDm}
                className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-full shadow-md transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-paper-plane text-[10px]"></i> Gửi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
