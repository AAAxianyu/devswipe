// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  tech_stack: string; // 后端返回逗号分隔的字符串
  is_creator: boolean;
  follower_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user_id: number;
  username: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  tech_stack: string[];
}

// 项目相关类型
export interface Project {
  id: number;
  user_id: number;
  title: string;
  description: string;
  cover_image?: string;
  image_urls: string[]; // 前端期望为字符串数组（后端返回时可能为逗号分隔字符串）
  project_url?: string;
  status: 'concept' | 'demo' | 'mvp' | 'launched';
  view_count: number;
  like_count: number;
  dislike_count: number;
  super_like_count: number;
  skip_count: number;
  comment_count: number;
  completion_rate: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  tags: ProjectTag[];
}

export interface ProjectTag {
  id: number;
  project_id: number;
  tag_name: string;
  tag_type: 'tech' | 'domain' | 'function' | 'stage' | 'hackathon';
  created_at: string;
}

export interface ProjectStats {
  project_id: number;
  like_rate: number;
  view_rate: number;
  engagement_rate: number;
  total_views: number;
  total_likes: number;
  total_dislikes: number;
  total_comments: number;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  cover_image?: string;
  image_urls: string[];
  project_url?: string;
  status?: string;
  tags: string[];
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  cover_image?: string;
  image_urls?: string[];
  project_url?: string;
  status?: string;
  tags?: string[];
  is_public?: boolean;
}

// 交互相关类型
export type InteractionType = 'like' | 'dislike' | 'super_like' | 'skip' | 'bookmark';

export interface InteractionRequest {
  project_id: number;
  type: InteractionType;
  structured_feedback?: string;
  view_duration: number;
  session_id: string;
}

export interface UserInteraction {
  id: number;
  user_id: number;
  project_id: number;
  interaction_type: InteractionType;
  structured_feedback?: string;
  session_id: string;
  view_duration: number;
  created_at: string;
  user: User;
  project: Project;
}

export interface Comment {
  id: number;
  user_id: number;
  project_id: number;
  parent_id?: number;
  content: string;
  is_technical: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  user: User;
  project: Project;
  parent?: Comment;
  replies: Comment[];
}

export interface CommentRequest {
  project_id: number;
  content: string;
  parent_id?: number;
}

// 收藏相关类型
export interface Collection {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  is_public: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
  user: User;
  items: CollectionItem[];
}

export interface CollectionItem {
  id: number;
  collection_id: number;
  project_id: number;
  notes?: string;
  created_at: string;
  collection: Collection;
  project: Project;
}

// API响应类型
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

export interface FeedResponse {
  projects: Project[];
  has_more: boolean;
  page: number;
  session_id: string;
}

// 表单相关类型
export interface FormErrors {
  [key: string]: string;
}

// 路由相关类型
export interface RouteParams {
  id: string;
}

// 状态管理相关类型
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  projects: ProjectState;
}
