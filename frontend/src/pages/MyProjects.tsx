import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Project } from '../types';
import ProjectCard from '../components/project/ProjectCard';

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyProjects(true);
  }, []);

  const loadMyProjects = async (reset = false) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        navigate('/login');
        return;
      }

      const limit = 9;
      const offset = reset ? 0 : (page - 1) * limit;
      const response = await apiService.getUserProjects(user.id, limit, offset);
      const newList = reset ? response.projects : [...projects, ...response.projects];
      setProjects(newList);
      setHasMore(response.projects.length === limit);
      if (reset) setPage(1);
    } catch (err: any) {
      console.error('加载项目失败:', err);
      setError(err.response?.data?.error || '加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm('确定要删除这个项目吗？')) {
      return;
    }

    try {
      await apiService.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err: any) {
      alert(err.response?.data?.error || '删除项目失败');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => loadMyProjects()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的项目</h1>
          <p className="text-gray-600 mt-2">管理和查看你上传的所有项目</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>上传新项目</span>
        </button>
      </div>

      {/* 项目统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">总项目数</div>
          <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">总浏览量</div>
          <div className="text-3xl font-bold text-blue-600">
            {projects.reduce((sum, p) => sum + (p.view_count || 0), 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">总点赞数</div>
          <div className="text-3xl font-bold text-green-600">
            {projects.reduce((sum, p) => sum + (p.like_count || 0), 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600 mb-1">总评论数</div>
          <div className="text-3xl font-bold text-purple-600">
            {projects.reduce((sum, p) => sum + (p.comment_count || 0), 0)}
          </div>
        </div>
      </div>

      {/* 项目列表 */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有项目</h3>
          <p className="text-gray-600 mb-6">上传你的第一个项目，开始展示你的作品吧！</p>
          <button
            onClick={() => navigate('/upload')}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            上传项目
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={project.id} className="relative group">
              <ProjectCard
                project={project}
                onSwipe={() => {}}
                onBookmark={() => {}}
                onComment={() => {}}
                currentIndex={index}
                totalCount={projects.length}
              />
              
              {/* 操作按钮 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/project/${project.id}/edit`);
                  }}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg"
                  title="编辑"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                  title="删除"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* 项目统计信息 */}
              <div className="mt-4 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-gray-600">浏览</div>
                    <div className="font-semibold text-gray-900">{project.view_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">点赞</div>
                    <div className="font-semibold text-green-600">{project.like_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">评论</div>
                    <div className="font-semibold text-purple-600">{project.comment_count || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setPage(prev => prev + 1);
              loadMyProjects(false);
            }}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProjects;

