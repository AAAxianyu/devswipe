import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProjectCard from '../components/project/ProjectCard';
import { apiService } from '../services/api';
import { Project } from '../types';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setProjects([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.searchProjects(searchKeyword.trim());
      setProjects(response.projects);
    } catch (err: any) {
      console.error('搜索失败:', err);
      setError(err.response?.data?.error || '搜索失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: keyword });
    handleSearch(keyword);
  };

  // 页面加载时如果有搜索参数，自动搜索
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setKeyword(query);
      handleSearch(query);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* 搜索框 */}
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索项目名称、描述或技术栈..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '搜索中...' : '搜索'}
                </button>
              </div>
            </form>
          </div>

          {/* 搜索结果 */}
          <div>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">搜索中...</p>
              </div>
            )}

            {!loading && !error && keyword && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  搜索结果: "{keyword}"
                </h2>
                <p className="text-gray-600">
                  找到 {projects.length} 个项目
                </p>
              </div>
            )}

            {!loading && !error && projects.length === 0 && keyword && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关项目</h3>
                <p className="text-gray-600">尝试使用不同的关键词搜索</p>
              </div>
            )}

            {!loading && !error && !keyword && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💡</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索项目</h3>
                <p className="text-gray-600">输入关键词来发现有趣的项目</p>
              </div>
            )}

            {/* 项目列表 */}
            {projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    onSwipe={() => {}}
                    onBookmark={() => {}}
                    onComment={() => {}}
                    currentIndex={index}
                    totalCount={projects.length}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Search;
