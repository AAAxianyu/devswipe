import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  InteractionRequest,
  CommentRequest,
  Comment,
  ProjectStats,
  FeedResponse
} from '../types';

class ApiService {
  private api: AxiosInstance;

  // Normalize project fields returned from backend to match frontend types
  private normalizeProject(p: any): Project {
    if (!p) return p;
    const normalized: any = { ...p };
    if (typeof normalized.image_urls === 'string') {
      normalized.image_urls = normalized.image_urls === '' ? [] : normalized.image_urls.split(',');
    }
    return normalized as Project;
  }

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加认证token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 处理错误
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token过期，清除本地存储并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 认证相关API
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/users/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.put('/users/me', data);
    return response.data;
  }

  // 用户相关API
  async followUser(userId: number): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.post(`/users/${userId}/follow`);
    return response.data;
  }

  async unfollowUser(userId: number): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.delete(`/users/${userId}/follow`);
    return response.data;
  }

  async getFollowers(userId: number, limit = 20, offset = 0): Promise<{ followers: User[] }> {
    const response: AxiosResponse<{ followers: User[] }> = await this.api.get(
      `/users/${userId}/followers?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }

  async getFollowing(userId: number, limit = 20, offset = 0): Promise<{ following: User[] }> {
    const response: AxiosResponse<{ following: User[] }> = await this.api.get(
      `/users/${userId}/following?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }

  // 项目相关API
  async getFeed(page = 1, limit = 6, sessionId?: string): Promise<FeedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (sessionId) {
      params.append('session_id', sessionId);
    }

    const response: AxiosResponse<FeedResponse> = await this.api.get(`/projects/feed?${params}`);
    // Normalize projects' image_urls to string[] for frontend consumption
    const data = response.data;
  data.projects = data.projects.map(p => this.normalizeProject(p));
    return data;
  }

  async getProject(projectId: number): Promise<Project> {
    const response: AxiosResponse<Project> = await this.api.get(`/projects/${projectId}`);
  return this.normalizeProject(response.data);
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response: AxiosResponse<Project> = await this.api.post('/projects', data);
  return this.normalizeProject(response.data);
  }

  async updateProject(projectId: number, data: UpdateProjectRequest): Promise<Project> {
    const response: AxiosResponse<Project> = await this.api.put(`/projects/${projectId}`, data);
  return this.normalizeProject(response.data);
  }

  async deleteProject(projectId: number): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.delete(`/projects/${projectId}`);
    return response.data;
  }

  async getUserProjects(userId: number, limit = 20, offset = 0): Promise<{ projects: Project[] }> {
    const response: AxiosResponse<{ projects: Project[] }> = await this.api.get(
      `/users/${userId}/projects?limit=${limit}&offset=${offset}`
    );
    const data = response.data;
  data.projects = data.projects.map(p => this.normalizeProject(p));
    return data;
  }

  async searchProjects(keyword: string, limit = 20, offset = 0): Promise<{ projects: Project[]; keyword: string }> {
    const response: AxiosResponse<{ projects: Project[]; keyword: string }> = await this.api.get(
      `/projects/search?q=${encodeURIComponent(keyword)}&limit=${limit}&offset=${offset}`
    );
    const data = response.data;
  data.projects = data.projects.map(p => this.normalizeProject(p));
    return data;
  }

  async getProjectStats(projectId: number): Promise<ProjectStats> {
    const response: AxiosResponse<ProjectStats> = await this.api.get(`/projects/${projectId}/stats`);
    return response.data;
  }

  // 交互相关API
  async interactWithProject(projectId: number, data: InteractionRequest): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.post(`/projects/${projectId}/interact`, data);
    return response.data;
  }

  async addComment(projectId: number, data: CommentRequest): Promise<Comment> {
    const response: AxiosResponse<Comment> = await this.api.post(`/projects/${projectId}/comments`, data);
    return response.data;
  }

  async getComments(projectId: number, limit = 20, offset = 0): Promise<{ comments: Comment[] }> {
    const response: AxiosResponse<{ comments: Comment[] }> = await this.api.get(
      `/projects/${projectId}/comments?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

// Helper: normalize project fields returned from backend to match frontend types
function normalizeProject(p: any) {
  if (!p) return p;
  // backend returns image_urls as comma separated string; frontend expects string[]
  const normalized = { ...p } as any;
  if (typeof normalized.image_urls === 'string') {
    normalized.image_urls = normalized.image_urls === '' ? [] : normalized.image_urls.split(',');
  }
  return normalized;
}
