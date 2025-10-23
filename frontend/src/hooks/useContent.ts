import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback } from 'react';
import { RootState, InteractionType } from '../types';
import { AppDispatch } from '../store';
import {
  loadMoreContent,
  submitInteraction,
  handleSwipe,
  resetContent,
  setCurrentIndex
} from '../store/slices/contentSlice';

export const useContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    currentIndex,
    isLoading,
    error,
    hasMore,
    page,
    sessionId,
    interactions
  } = useSelector((state: RootState) => state.content);

  // 初始加载
  useEffect(() => {
    if (items.length === 0 && !isLoading && hasMore) {
      dispatch(loadMoreContent(page));
    }
  }, [items.length, isLoading, hasMore, page]);

  // 处理滑动交互
  const handleSwipeInteraction = useCallback((
    itemId: number,
    direction: InteractionType,
    viewStartTime: number = Date.now()
  ) => {
    const viewDuration = (Date.now() - viewStartTime) / 1000;

    // 更新本地状态
    dispatch(handleSwipe({
      itemId,
      direction,
      viewDuration
    }));

    // 异步提交到服务器
    dispatch(submitInteraction({
      itemId,
      interactionType: direction,
      viewDuration
    }));
  }, [dispatch]);

  // 处理快速操作
  const handleQuickAction = useCallback((
    direction: 'like' | 'dislike',
    viewStartTime: number = Date.now()
  ) => {
    if (currentIndex < items.length) {
      const currentItem = items[currentIndex];
      handleSwipeInteraction(currentItem.id, direction, viewStartTime);
    }
  }, [currentIndex, items, handleSwipeInteraction]);

  // 加载更多内容
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(loadMoreContent(page));
    }
  }, [hasMore, isLoading, page]);

  // 重置内容
  const reset = useCallback(() => {
    dispatch(resetContent());
  }, [dispatch]);

  // 跳转到指定索引
  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      dispatch(setCurrentIndex(index));
    }
  }, [dispatch, items.length]);

  // 获取当前项目
  const currentItem = items[currentIndex] || null;

  // 获取进度
  const progress = {
    current: currentIndex + 1,
    total: items.length
  };

  // 获取统计信息
  const getInteractionStats = useCallback(() => {
    const stats = {
      total: 0,
      likes: 0,
      dislikes: 0,
      superLikes: 0,
      skips: 0
    };

    Object.values(interactions).forEach(interaction => {
      stats.total += 1;
      switch (interaction) {
        case 'like':
          stats.likes += 1;
          break;
        case 'dislike':
          stats.dislikes += 1;
          break;
        case 'super_like':
          stats.superLikes += 1;
          break;
        case 'skip':
          stats.skips += 1;
          break;
      }
    });

    return stats;
  }, [interactions]);

  return {
    // 数据状态
    items,
    currentItem,
    currentIndex,
    progress,
    isLoading,
    error,
    hasMore,
    sessionId,
    interactions,

    // 操作方法
    handleSwipe: handleSwipeInteraction,
    handleQuickAction,
    loadMore,
    reset,
    goToIndex,

    // 统计信息
    getInteractionStats,
    hasItems: items.length > 0
  };
};

export default useContent;