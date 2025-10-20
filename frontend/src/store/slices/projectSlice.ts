import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, FeedResponse } from '../../types';

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  feedProjects: Project[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  sessionId: string | null;
}

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  feedProjects: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  sessionId: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFeedProjects: (state, action: PayloadAction<FeedResponse>) => {
      state.feedProjects = action.payload.projects;
      state.hasMore = action.payload.has_more;
      state.sessionId = action.payload.session_id;
      state.currentIndex = 0;
      state.currentProject = action.payload.projects[0] || null;
    },
    appendFeedProjects: (state, action: PayloadAction<FeedResponse>) => {
      state.feedProjects = [...state.feedProjects, ...action.payload.projects];
      state.hasMore = action.payload.has_more;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    nextProject: (state) => {
      if (state.currentIndex < state.feedProjects.length - 1) {
        state.currentIndex += 1;
        state.currentProject = state.feedProjects[state.currentIndex];
      }
    },
    previousProject: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentProject = state.feedProjects[state.currentIndex];
      }
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      
      // 更新feed中的项目
      const feedIndex = state.feedProjects.findIndex(p => p.id === action.payload.id);
      if (feedIndex !== -1) {
        state.feedProjects[feedIndex] = action.payload;
      }
      
      // 更新当前项目
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload;
      }
    },
    removeProject: (state, action: PayloadAction<number>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      state.feedProjects = state.feedProjects.filter(p => p.id !== action.payload);
      
      // 如果删除的是当前项目，切换到下一个
      if (state.currentProject?.id === action.payload) {
        if (state.currentIndex < state.feedProjects.length - 1) {
          state.currentProject = state.feedProjects[state.currentIndex];
        } else if (state.currentIndex > 0) {
          state.currentIndex -= 1;
          state.currentProject = state.feedProjects[state.currentIndex];
        } else {
          state.currentProject = null;
        }
      }
    },
    updateProjectStats: (state, action: PayloadAction<{ projectId: number; stats: Partial<Project> }>) => {
      const { projectId, stats } = action.payload;
      
      // 更新项目列表中的统计
      const projectIndex = state.projects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...stats };
      }
      
      // 更新feed中的统计
      const feedIndex = state.feedProjects.findIndex(p => p.id === projectId);
      if (feedIndex !== -1) {
        state.feedProjects[feedIndex] = { ...state.feedProjects[feedIndex], ...stats };
      }
      
      // 更新当前项目统计
      if (state.currentProject?.id === projectId) {
        state.currentProject = { ...state.currentProject, ...stats };
      }
    },
    resetFeed: (state) => {
      state.feedProjects = [];
      state.currentIndex = 0;
      state.currentProject = null;
      state.hasMore = true;
      state.sessionId = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setFeedProjects,
  appendFeedProjects,
  setCurrentProject,
  nextProject,
  previousProject,
  setProjects,
  addProject,
  updateProject,
  removeProject,
  updateProjectStats,
  resetFeed,
} = projectSlice.actions;

export default projectSlice.reducer;
