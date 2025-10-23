import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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

interface ContentState {
  items: ContentItem[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  sessionId: string;
  interactions: Record<number, InteractionType>;
}

const initialState: ContentState = {
  items: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
  sessionId: generateSessionId(),
  interactions: {}
};

function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 模拟API数据
const mockData: ContentItem[] = [
  {
    id: 1,
    title: "AI 聊天机器人",
    description: "基于 GPT-4 的智能对话助手，支持多轮对话、上下文理解和个性化回复。集成了最新的自然语言处理技术，为用户提供流畅的对话体验。",
    mediaUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    mediaType: "image",
    user: {
      id: 1,
      username: "张开发",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    tags: [
      { id: 1, tag_name: "AI", tag_type: "tech" },
      { id: 2, tag_name: "ChatGPT", tag_type: "tech" },
      { id: 3, tag_name: "对话系统", tag_type: "function" }
    ],
    status: "demo",
    stats: {
      like_count: 234,
      view_count: 1520,
      comment_count: 45
    }
  },
  {
    id: 2,
    title: "实时协作白板",
    description: "支持多人实时协作的在线白板工具，内置丰富的绘图工具、模板库和实时同步功能，让远程团队协作更高效。",
    mediaUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    mediaType: "image",
    user: {
      id: 2,
      username: "李设计",
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=40&h=40&fit=crop&crop=face"
    },
    tags: [
      { id: 4, tag_name: "协作工具", tag_type: "function" },
      { id: 5, tag_name: "实时同步", tag_type: "tech" },
      { id: 6, tag_name: "设计工具", tag_type: "domain" }
    ],
    status: "mvp",
    stats: {
      like_count: 189,
      view_count: 890,
      comment_count: 32
    }
  },
  {
    id: 3,
    title: "区块链投票系统",
    description: "基于智能合约的去中心化投票平台，确保投票过程的透明性、安全性和不可篡改性。适用于社区治理、企业决策等多种场景。",
    mediaUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    mediaType: "image",
    user: {
      id: 3,
      username: "王区块",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    tags: [
      { id: 7, tag_name: "区块链", tag_type: "tech" },
      { id: 8, tag_name: "智能合约", tag_type: "tech" },
      { id: 9, tag_name: "治理工具", tag_type: "function" }
    ],
    status: "concept",
    stats: {
      like_count: 456,
      view_count: 2100,
      comment_count: 78
    }
  },
  {
    id: 4,
    title: "视频剪辑AI助手",
    description: "使用人工智能技术自动识别视频中的精彩片段，智能生成短视频剪辑。支持自动配乐、字幕生成和特效添加。",
    mediaUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    mediaType: "video",
    user: {
      id: 4,
      username: "赵视频",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    tags: [
      { id: 10, tag_name: "视频处理", tag_type: "domain" },
      { id: 11, tag_name: "AI算法", tag_type: "tech" },
      { id: 12, tag_name: "自动化", tag_type: "function" }
    ],
    status: "launched",
    stats: {
      like_count: 672,
      view_count: 3400,
      comment_count: 95
    }
  },
  {
    id: 5,
    title: "AR家居试装应用",
    description: "增强现实技术的家居预览应用，让用户在家中就能看到家具的实际摆放效果，支持实时光影追踪和尺寸测量。",
    mediaUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    mediaType: "image",
    user: {
      id: 5,
      username: "陈AR",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    tags: [
      { id: 13, tag_name: "增强现实", tag_type: "tech" },
      { id: 14, tag_name: "家居", tag_type: "domain" },
      { id: 15, tag_name: "可视化", tag_type: "function" }
    ],
    status: "demo",
    stats: {
      like_count: 523,
      view_count: 2890,
      comment_count: 67
    }
  }
];

// 异步thunk - 加载更多内容
export const loadMoreContent = createAsyncThunk(
  'content/loadMore',
  async (page: number, { rejectWithValue }) => {
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟分页逻辑
      const itemsPerPage = 3;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // 循环使用模拟数据
      const items = mockData.map((item, index) => ({
        ...item,
        id: item.id + (page - 1) * mockData.length
      })).slice(startIndex % mockData.length, endIndex % mockData.length || mockData.length);

      if (items.length === 0) {
        return {
          items: [],
          hasMore: false
        };
      }

      return {
        items,
        hasMore: page < 10 // 限制最多10页
      };
    } catch (error) {
      return rejectWithValue('加载内容失败');
    }
  }
);

// 异步thunk - 提交交互
export const submitInteraction = createAsyncThunk(
  'content/submitInteraction',
  async ({ itemId, interactionType, viewDuration }: {
    itemId: number;
    interactionType: InteractionType;
    viewDuration: number;
  }) => {
    try {
      // 模拟API提交
      await new Promise(resolve => setTimeout(resolve, 500));

      // 这里应该调用实际的API
      console.log('提交交互:', { itemId, interactionType, viewDuration });

      return { itemId, interactionType };
    } catch (error) {
      throw error;
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // 处理滑动交互
    handleSwipe: (state, action: PayloadAction<{
      itemId: number;
      direction: InteractionType;
      viewDuration: number;
    }>) => {
      const { itemId, direction, viewDuration } = action.payload;

      // 记录交互
      state.interactions[itemId] = direction;

      // 移动到下一张卡片
      if (state.currentIndex < state.items.length - 1) {
        state.currentIndex += 1;
      }
    },

    // 重置内容
    resetContent: (state) => {
      state.items = [];
      state.currentIndex = 0;
      state.hasMore = true;
      state.page = 1;
      state.sessionId = generateSessionId();
      state.interactions = {};
    },

    // 设置当前索引
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 加载更多内容
      .addCase(loadMoreContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadMoreContent.fulfilled, (state, action) => {
        state.isLoading = false;
        const { items, hasMore } = action.payload;

        if (state.page === 1) {
          // 第一页，直接替换
          state.items = items;
        } else {
          // 后续页，追加内容
          state.items.push(...items);
        }

        state.hasMore = hasMore;
        state.page += 1;
      })
      .addCase(loadMoreContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 提交交互
      .addCase(submitInteraction.pending, (state) => {
        // 可以在这里显示加载状态
      })
      .addCase(submitInteraction.fulfilled, (state, action) => {
        const { itemId, interactionType } = action.payload;

        // 更新本地状态
        const item = state.items.find(item => item.id === itemId);
        if (item?.stats) {
          switch (interactionType) {
            case 'like':
              item.stats.like_count += 1;
              break;
            case 'dislike':
              // 不更新不喜欢计数
              break;
            case 'super_like':
              item.stats.like_count += 2; // 超级喜欢算作2个喜欢
              break;
          }
        }
      })
      .addCase(submitInteraction.rejected, (state, action) => {
        console.error('提交交互失败:', action.error);
        state.error = '提交交互失败';
      });
  }
});

export const { handleSwipe, resetContent, setCurrentIndex } = contentSlice.actions;
export default contentSlice.reducer;