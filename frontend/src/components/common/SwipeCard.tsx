import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { InteractionType } from '../../types';

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

interface SwipeCardProps {
  item: ContentItem;
  onSwipe: (direction: InteractionType) => void;
  onQuickAction: (direction: 'like' | 'dislike') => void;
  onCardClick: () => void;
  index: number;
  total: number;
  isPreview?: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  item,
  onSwipe,
  onQuickAction,
  onCardClick,
  index,
  total,
  isPreview = false
}) => {
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewStartTime, setViewStartTime] = useState(Date.now());
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 记录观看开始时间
  useEffect(() => {
    setViewStartTime(Date.now());
  }, [item.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPreview) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isPreview) return;
    const currentX = e.touches[0].clientX;
    setOffsetX(currentX - startX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isPreview) return;
    setOffsetX(e.clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isPreview) return;
    handleSwipeEnd();
  };

  const handleMouseUp = () => {
    if (!isDragging || isPreview) return;
    handleSwipeEnd();
  };

  const handleSwipeEnd = () => {
    const threshold = 120;
    const viewDuration = (Date.now() - viewStartTime) / 1000;

    if (Math.abs(offsetX) > threshold) {
      // 向左滑动 (负偏移) = 喜欢，向右滑动 (正偏移) = 不喜欢
      if (offsetX < 0) {
        onSwipe('like');
      } else {
        onSwipe('dislike');
      }
    } else {
      // 重置位置
      setOffsetX(0);
      setIsDragging(false);
    }

    // 确保在滑动完成后重置状态
    setTimeout(() => {
      setOffsetX(0);
      setIsDragging(false);
    }, 100);
  };

  const handleDoubleClick = () => {
    if (isPreview) return;
    onSwipe('super_like');
  };

  const handleCardClick = () => {
    if (isPreview || isDragging) return;
    onCardClick();
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'demo': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'mvp': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'launched': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concept': return '概念';
      case 'demo': return '演示';
      case 'mvp': return 'MVP';
      case 'launched': return '已发布';
      default: return status;
    }
  };

  const getSwipeHint = () => {
    if (Math.abs(offsetX) < 50) return null;

    // 向左滑动 (负偏移) = 喜欢，向右滑动 (正偏移) = 不喜欢
    const direction = offsetX < 0 ? 'like' : 'dislike';
    const colors = {
      like: 'bg-green-500/20 border-green-400',
      dislike: 'bg-red-500/20 border-red-400'
    };

    const icons = {
      like: '❤️',
      dislike: '❌'
    };

    return (
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${colors[direction]} backdrop-blur-md border-2 rounded-full p-6 z-50`}>
        <span className="text-4xl">{icons[direction]}</span>
      </div>
    );
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute inset-0 bg-gradient-to-br from-white/[0.1] to-white/[0.05] backdrop-blur-xl border border-white/[0.2] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden ${isPreview ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
      animate={{
        transform: isPreview
          ? 'scale(0.9) translateY(20px)'
          : `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)`,
        opacity: isPreview ? 0.7 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* 媒体内容区域 */}
      <div className="relative h-3/4 bg-black/20">
        {item.mediaType === 'image' ? (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="w-full h-full object-cover cursor-pointer hover:brightness-95 transition-all duration-200"
            draggable={false}
            onClick={handleCardClick}
          />
        ) : (
          <video
            ref={videoRef}
            src={item.mediaUrl}
            className="w-full h-full object-cover cursor-pointer"
            controls={!isDragging}
            muted
            loop
            playsInline
            onLoadedMetadata={handleVideoLoadedMetadata}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                } else {
                  videoRef.current.pause();
                }
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          />
        )}

        {/* 视频播放指示器 */}
        {item.mediaType === 'video' && !isDragging && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
                style={{
                  width: videoRef.current ?
                    `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` :
                    '0%'
                }}
              />
            </div>
          </div>
        )}

        {/* 状态标签 */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(item.status)}`}>
            {getStatusText(item.status)}
          </span>
        </div>

        {/* 顶部按钮组 */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {/* 查看详情按钮 */}
          <button
            onClick={handleCardClick}
            disabled={isPreview || isDragging}
            className="bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            title="查看详情"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* 进度指示器 */}
          <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
            {index + 1} / {total}
          </div>
        </div>

        {/* 滑动提示 */}
        {getSwipeHint()}
      </div>

      {/* 信息区域 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
        <div className="flex items-center space-x-3 mb-3">
          {item.user.avatar_url ? (
            <img
              src={item.user.avatar_url}
              alt={item.user.username}
              className="w-8 h-8 rounded-full border border-white/20"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {item.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-white text-sm font-medium">
            {item.user.username}
          </span>
        </div>

        <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
          {item.title}
        </h3>

        <p className="text-white/80 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* 标签 */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs rounded-full"
              >
                #{tag.tag_name}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs rounded-full">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 统计信息 */}
        {item.stats && (
          <div className="flex items-center space-x-4 text-white/60 text-xs">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {item.stats.like_count}
            </span>
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {item.stats.comment_count}
            </span>
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {item.stats.view_count}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCard;