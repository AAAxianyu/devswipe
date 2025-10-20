import React, { useState, useRef, useEffect } from 'react';
import { InteractionType } from '../../types';
import clsx from 'clsx';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    image_urls: string[];
    cover_image?: string;
    project_url?: string;
    status: string;
    view_count: number;
    like_count: number;
    dislike_count: number;
    super_like_count: number;
    comment_count: number;
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
  };
  onSwipe: (direction: InteractionType) => void;
  onBookmark: (projectId: number) => void;
  onComment: (projectId: number) => void;
  currentIndex: number;
  totalCount: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSwipe,
  onBookmark,
  onComment,
  currentIndex,
  totalCount
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewStartTime, setViewStartTime] = useState(Date.now());
  const cardRef = useRef<HTMLDivElement>(null);

  // 记录观看开始时间
  useEffect(() => {
    setViewStartTime(Date.now());
  }, [project.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setOffsetX(currentX - startX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    handleSwipeEnd();
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    handleSwipeEnd();
  };

  const handleSwipeEnd = () => {
    const threshold = 100;
    const viewDuration = (Date.now() - viewStartTime) / 1000;
    
    if (Math.abs(offsetX) > threshold) {
      if (offsetX > 0) {
        onSwipe('like');
      } else {
        onSwipe('dislike');
      }
    } else {
      // 重置位置
      setOffsetX(0);
    }
    
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    onSwipe('super_like');
  };

  const nextImage = () => {
    if (currentImageIndex < project.image_urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept': return 'bg-yellow-100 text-yellow-800';
      case 'demo': return 'bg-blue-100 text-blue-800';
      case 'mvp': return 'bg-green-100 text-green-800';
      case 'launched': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div 
      ref={cardRef}
      className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      style={{ 
        transform: `translateX(${offsetX}px) rotate(${offsetX * 0.1}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* 图片轮播 */}
      <div className="relative h-80 bg-gray-200">
        {project.image_urls.length > 0 ? (
          <>
            <img
              src={project.image_urls[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* 图片指示器 */}
            {project.image_urls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {project.image_urls.map((_, index) => (
                  <button
                    key={index}
                    className={clsx(
                      'w-2 h-2 rounded-full transition-colors',
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
            
            {/* 图片导航按钮 */}
            {project.image_urls.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentImageIndex < project.image_urls.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* 状态标签 */}
        <div className="absolute top-4 left-4">
          <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(project.status))}>
            {getStatusText(project.status)}
          </span>
        </div>
        
        {/* 进度指示器 */}
        <div className="absolute top-4 right-4 bg-black/20 text-white px-2 py-1 rounded-full text-xs">
          {currentIndex + 1}/{totalCount}
        </div>
      </div>
      
      {/* 项目信息 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {project.user.avatar_url ? (
              <img 
                src={project.user.avatar_url} 
                alt={project.user.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {project.user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {project.user.username}
            </span>
          </div>
          
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              查看项目 →
            </a>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {/* 标签 */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map(tag => (
              <span 
                key={tag.id} 
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{tag.tag_name}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {project.like_count}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {project.comment_count}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {project.view_count}
            </span>
          </div>
        </div>
      </div>
      
      {/* 交互按钮 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={() => onSwipe('dislike')}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button
          onClick={() => onBookmark(project.id)}
          className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        
        <button
          onClick={() => onComment(project.id)}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        
        <button
          onClick={() => onSwipe('like')}
          className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
