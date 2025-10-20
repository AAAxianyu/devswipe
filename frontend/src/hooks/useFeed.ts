import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  setLoading, 
  setError, 
  setFeedProjects, 
  appendFeedProjects, 
  nextProject, 
  updateProjectStats,
  resetFeed 
} from '../store/slices/projectSlice';
import { InteractionRequest, InteractionType } from '../types';
import apiService from '../services/api';

export const useFeed = () => {
  const dispatch = useDispatch();
  const { 
    currentProject, 
    feedProjects, 
    currentIndex, 
    isLoading, 
    error, 
    hasMore, 
    sessionId 
  } = useSelector((state: RootState) => state.projects);

  const [sessionIdState, setSessionIdState] = useState<string>('');

  // 生成会话ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // 加载更多项目
  const loadMoreProjects = useCallback(async (page = 1, limit = 6) => {
    if (isLoading) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const currentSessionId = sessionIdState || generateSessionId();
      if (!sessionIdState) {
        setSessionIdState(currentSessionId);
      }

      const response = await apiService.getFeed(page, limit, currentSessionId);
      
      if (page === 1) {
        dispatch(setFeedProjects(response));
      } else {
        dispatch(appendFeedProjects(response));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '加载项目失败';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, isLoading, sessionIdState, generateSessionId]);

  // 处理滑动交互
  const handleSwipe = useCallback(async (direction: InteractionType, viewDuration = 0) => {
    if (!currentProject) return;

    try {
      const interactionData: InteractionRequest = {
        project_id: currentProject.id,
        type: direction,
        view_duration: viewDuration,
        session_id: sessionIdState,
      };

      await apiService.interactWithProject(currentProject.id, interactionData);

      // 更新项目统计
      const statsUpdate: Partial<typeof currentProject> = {};
      switch (direction) {
        case 'like':
          statsUpdate.like_count = currentProject.like_count + 1;
          break;
        case 'dislike':
          statsUpdate.dislike_count = currentProject.dislike_count + 1;
          break;
        case 'super_like':
          statsUpdate.super_like_count = currentProject.super_like_count + 1;
          break;
        case 'skip':
          statsUpdate.skip_count = currentProject.skip_count + 1;
          break;
      }

      dispatch(updateProjectStats({ 
        projectId: currentProject.id, 
        stats: statsUpdate 
      }));

      // 移动到下一个项目
      dispatch(nextProject());

      // 如果接近末尾，预加载更多项目
      if (currentIndex >= feedProjects.length - 3 && hasMore) {
        const nextPage = Math.floor(feedProjects.length / 6) + 1;
        loadMoreProjects(nextPage);
      }
    } catch (error: any) {
      console.error('Failed to record interaction:', error);
    }
  }, [currentProject, currentIndex, feedProjects.length, hasMore, sessionIdState, dispatch, loadMoreProjects]);

  // 重置feed
  const resetFeedData = useCallback(() => {
    dispatch(resetFeed());
    setSessionIdState('');
  }, [dispatch]);

  // 初始化加载
  useEffect(() => {
    if (feedProjects.length === 0) {
      loadMoreProjects(1);
    }
  }, [feedProjects.length, loadMoreProjects]);

  return {
    currentProject,
    progress: {
      current: currentIndex + 1,
      total: feedProjects.length,
    },
    handleSwipe,
    loadMoreProjects,
    resetFeed: resetFeedData,
    isLoading,
    error,
    hasMore,
    sessionId: sessionIdState,
  };
};
