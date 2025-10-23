import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractionType } from '../../types';
import SwipeCard from './SwipeCard';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  user: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  tags: Array<{
    id: number;
    tag_name: string;
    tag_type: string;
  }>;
  status: string;
  stats?: {
    like_count: number;
    view_count: number;
    comment_count: number;
  };
}

interface CardContainerProps {
  items: ContentItem[];
  currentIndex: number;
  onSwipe: (itemId: number, direction: InteractionType) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const CardContainer: React.FC<CardContainerProps> = ({
  items,
  currentIndex,
  onSwipe,
  onLoadMore,
  hasMore,
  isLoading
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: InteractionType) => {
    if (currentIndex < items.length) {
      const currentItem = items[currentIndex];
      onSwipe(currentItem.id, direction);
    }
  };

  const handleQuickAction = (direction: 'like' | 'dislike') => {
    handleSwipe(direction);
  };

  // 当接近列表末尾时自动加载更多
  React.useEffect(() => {
    if (currentIndex >= items.length - 2 && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [currentIndex, items.length, hasMore, isLoading]);

  return (
    <div className="relative w-full h-[600px] max-w-md mx-auto" ref={containerRef}>
      <AnimatePresence>
        {items.map((item, index) => {
          if (index !== currentIndex) return null;

          return (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }
              }}
              exit={{
                x: 200,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3 }
              }}
              style={{ zIndex: items.length - index }}
            >
              <SwipeCard
                item={item}
                onSwipe={handleSwipe}
                onQuickAction={handleQuickAction}
                index={index}
                total={items.length}
              />
            </motion.div>
          );
        })}

        {/* 下一张卡片的预览 */}
        {items[currentIndex + 1] && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0.7, opacity: 0.5 }}
            animate={{
              scale: 0.85,
              opacity: 0.7,
              transition: { duration: 0.2 }
            }}
            style={{
              zIndex: items.length - (currentIndex + 1),
              transform: 'scale(0.9) translateY(20px)'
            }}
          >
            <SwipeCard
              item={items[currentIndex + 1]}
              onSwipe={() => {}}
              onQuickAction={() => {}}
              index={currentIndex + 1}
              total={items.length}
              isPreview
            />
          </motion.div>
        )}

        {/* 无内容时的占位 */}
        {!isLoading && items.length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] rounded-xl flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <p className="text-white/80 text-lg mb-2">暂无内容</p>
              <p className="text-white/60 text-sm">敬请期待更多精彩内容</p>
            </div>
          </motion.div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] rounded-xl flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              </motion.div>
              <p className="text-white/80 text-lg">加载中...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 快捷操作按钮 */}
      {!isLoading && items.length > 0 && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => handleQuickAction('dislike')}
            className="w-14 h-14 bg-gradient-to-br from-red-500/80 to-red-600/80 backdrop-blur-sm border border-white/[0.2] text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(239,68,68,0.4)] hover:shadow-[0_8px_32px_0_rgba(239,68,68,0.6)] transition-all duration-300"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          <motion.button
            onClick={() => handleSwipe('super_like')}
            className="w-14 h-14 bg-gradient-to-br from-yellow-500/80 to-yellow-600/80 backdrop-blur-sm border border-white/[0.2] text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(234,179,8,0.4)] hover:shadow-[0_8px_32px_0_rgba(234,179,8,0.6)] transition-all duration-300"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </motion.button>

          <motion.button
            onClick={() => handleQuickAction('like')}
            className="w-14 h-14 bg-gradient-to-br from-green-500/80 to-green-600/80 backdrop-blur-sm border border-white/[0.2] text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(34,197,94,0.4)] hover:shadow-[0_8px_32px_0_rgba(34,197,94,0.6)] transition-all duration-300"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* 进度指示器 */}
      {items.length > 0 && (
        <motion.div
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/[0.2] text-white px-3 py-1 rounded-full text-sm font-medium shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {currentIndex + 1} / {items.length}
        </motion.div>
      )}
    </div>
  );
};

export default CardContainer;