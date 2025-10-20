import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Project, User } from '../types';
import ProjectCard from '../components/project/ProjectCard';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const currentUserRaw = localStorage.getItem('user');
      const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
      const viewingUserId = id ? parseInt(id) : currentUser?.id;

      if (!viewingUserId) {
        navigate('/login');
        return;
      }

      setIsOwnProfile(!!currentUser && currentUser.id === viewingUserId);

      // 如果是查看自己的资料，调用 /users/me 获取最新资料
      if (isOwnProfile || (!id && currentUser)) {
        try {
          const me = await apiService.getProfile();
          setProfileUser(me);
          // 同步本地缓存用户
          localStorage.setItem('user', JSON.stringify(me));
        } catch {
          // 回退到本地缓存
          if (currentUser) setProfileUser(currentUser as User);
        }
      } else {
        // 查看他人资料：后端暂无按ID获取用户资料接口，这里先用精简信息展示
        // 为了至少显示用户名等信息，回退为空并仅展示项目列表
        setProfileUser(null);
      }

      // 加载该用户的项目
      const resp = await apiService.getUserProjects(viewingUserId, 30, 0);
      setProjects(resp.projects);
    } catch (e: any) {
      setError(e?.response?.data?.error || '加载用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!id) return;
    try {
      const userId = parseInt(id);
      if (isFollowing) {
        await apiService.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await apiService.followUser(userId);
        setIsFollowing(true);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || '操作失败');
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
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            {/* 头像 */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {(profileUser?.username || 'U').charAt(0).toUpperCase()}
            </div>

            {/* 用户信息 */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileUser?.username || (id ? `用户 #${id}` : '我的资料')}
              </h1>
              {profileUser?.email && (
                <p className="text-gray-600 mb-3">{profileUser.email}</p>
              )}
              {profileUser?.bio && (
                <p className="text-gray-700 mb-3">{profileUser.bio}</p>
              )}
              {profileUser?.tech_stack && (
                <div className="flex flex-wrap gap-2">
                  {profileUser.tech_stack.split(',').filter(Boolean).map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col space-y-2">
            {isOwnProfile ? (
              <button
                onClick={() => navigate('/settings')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                编辑资料
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-md transition-colors ${
                  isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? '已关注' : '关注'}
              </button>
            )}
          </div>
        </div>

        {/* 统计信息（若可用） */}
        <div className="flex space-x-8 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            <div className="text-sm text-gray-600">项目</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{profileUser?.follower_count ?? 0}</div>
            <div className="text-sm text-gray-600">粉丝</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{profileUser?.following_count ?? 0}</div>
            <div className="text-sm text-gray-600">关注</div>
          </div>
        </div>
      </div>

      {/* 项目列表 */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无项目</p>
            {isOwnProfile && (
              <button
                onClick={() => navigate('/upload')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                上传第一个项目
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={project.id} className="transform transition-transform hover:scale-105">
                <ProjectCard
                  project={project}
                  onSwipe={() => {}}
                  onBookmark={() => {}}
                  onComment={() => {}}
                  currentIndex={index}
                  totalCount={projects.length}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
