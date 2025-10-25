import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContainer from '../components/common/CardContainer';
import PostDetailModal from '../components/common/PostDetailModal';
import useContent from '../hooks/useContent';

const Swipe: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId?: string }>();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    items,
    currentIndex,
    handleSwipe,
    loadMore,
    hasMore,
    isLoading,
    error
  } = useContent();

  const handleCardClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    // 更新URL，添加帖子ID参数
    navigate(`/app/${post.id}`, { replace: true });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    // 移除URL中的帖子ID参数
    navigate('/app', { replace: true });
  };

  // 处理URL参数，自动打开对应帖子的详情
  useEffect(() => {
    if (postId && items.length > 0) {
      const post = items.find(item => item.id === parseInt(postId));
      if (post) {
        setSelectedPost(post);
        setIsModalOpen(true);
        // 如果帖子不在当前显示位置，可能需要调整currentIndex
        const postIndex = items.findIndex(item => item.id === parseInt(postId));
        if (postIndex !== -1 && postIndex !== currentIndex) {
          // 这里可以调整到对应帖子的位置
          // 但这需要修改useContent hook来支持设置currentIndex
        }
      } else {
        // 如果找不到对应的帖子，跳回到基础路径
        navigate('/app', { replace: true });
      }
    } else if (!postId && isModalOpen) {
      // 如果URL没有postId但modal是打开的，关闭modal
      setIsModalOpen(false);
      setSelectedPost(null);
    }
  }, [postId, items, currentIndex, isModalOpen, navigate]);

  return (
    <div className="h-screen bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-liquid-flow"
             style={{
               borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
             }}
        />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl animate-liquid-flow"
             style={{
               borderRadius: '40% 60% 70% 30% / 50% 60% 30% 70%',
               animationDelay: '4s'
             }}
        />
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-3xl animate-float"
             style={{
               borderRadius: '70% 30% 50% 50% / 30% 50% 60% 70%'
             }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.1] rounded-xl flex items-center justify-center relative shadow-[0_8px_32px_0_rgba(59,130,246,0.3)]">
                <span className="text-white font-bold text-sm relative z-10">DS</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl animate-glass-shimmer"
                     style={{
                       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                       backgroundSize: '200% 100%'
                     }}></div>
              </div>
              <span className="text-white font-semibold text-xl">DevSwipe</span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <button
                onClick={() => navigate('/publish')}
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.5)]"
              >
                发布项目
              </button>
              <button className="text-white/80 hover:text-white transition-colors duration-200">
                我的收藏
              </button>
              <button className="bg-white/[0.1] backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2 rounded-xl hover:bg-white/[0.15] transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.4)]">
                个人中心
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full pt-16">
        <CardContainer
          items={items}
          currentIndex={currentIndex}
          onSwipe={handleSwipe}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500/80 backdrop-blur-sm border border-red-400/30 text-white px-6 py-3 rounded-xl shadow-[0_8px_32px_0_rgba(239,68,68,0.4)]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          {error}
        </motion.div>
      )}

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Swipe;