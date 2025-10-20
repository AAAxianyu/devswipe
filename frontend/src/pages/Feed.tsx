import React, { useState } from 'react';
import { useFeed } from '../hooks/useFeed';
import ProjectCard from '../components/project/ProjectCard';
import { InteractionType } from '../types';

const Feed: React.FC = () => {
  const { 
    currentProject, 
    progress, 
    handleSwipe, 
    loadMoreProjects, 
    isLoading, 
    error, 
    hasMore 
  } = useFeed();
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState('');

  const handleSwipeWithFeedback = (direction: InteractionType) => {
    if (direction === 'dislike') {
      setShowFeedback(true);
    } else {
      handleSwipe(direction);
    }
  };

  const handleFeedbackSubmit = () => {
    handleSwipe('dislike');
    setShowFeedback(false);
    setFeedbackReason('');
  };

  const handleFeedbackCancel = () => {
    setShowFeedback(false);
    setFeedbackReason('');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">加载失败</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadMoreProjects(1)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!currentProject && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">暂无项目</div>
          <p className="text-gray-600">没有更多项目可以浏览了</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* 进度指示器 */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>发现项目</span>
            <span>{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>

        {/* 项目卡片 */}
        {currentProject && (
          <div className="mb-8">
            <ProjectCard
              project={currentProject}
              onSwipe={handleSwipeWithFeedback}
              onBookmark={(projectId) => {
                // TODO: 实现收藏功能
                console.log('Bookmark project:', projectId);
              }}
              onComment={(projectId) => {
                // TODO: 实现评论功能
                console.log('Comment on project:', projectId);
              }}
              currentIndex={progress.current - 1}
              totalCount={progress.total}
            />
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-2">加载中...</p>
          </div>
        )}

        {/* 加载更多按钮 */}
        {!isLoading && hasMore && (
          <div className="text-center">
            <button
              onClick={() => loadMoreProjects(Math.floor(progress.total / 6) + 1)}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              加载更多
            </button>
          </div>
        )}

        {/* 反馈弹窗 */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">为什么不喜欢这个项目？</h3>
              <div className="space-y-2 mb-4">
                {[
                  { value: 'not_interested', label: '不感兴趣' },
                  { value: 'unclear_problem', label: '问题不明确' },
                  { value: 'easy_tech', label: '技术太简单' },
                  { value: 'existing_products', label: '已有类似产品' },
                  { value: 'poor_demo', label: '演示效果差' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="feedback"
                      value={option.value}
                      checked={feedbackReason === option.value}
                      onChange={(e) => setFeedbackReason(e.target.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleFeedbackCancel}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
