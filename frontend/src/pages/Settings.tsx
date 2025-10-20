import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setAvatarUrl(user.avatar_url || '');
      setBio(user.bio || '');
      setTechStackInput(user.tech_stack || '');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    const techStack = techStackInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const res = await updateProfile({
      avatar_url: avatarUrl,
      bio,
      tech_stack: techStack as any,
    } as any);
    if (res.success) {
      setMessage('已保存');
    } else {
      setError(res.error || '保存失败');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">资料设置</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {message && <div className="p-3 bg-green-50 text-green-700 rounded">{message}</div>}
        {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">头像链接</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/avatar.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="介绍一下自己"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">技术栈（逗号分隔）</label>
          <input
            type="text"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="React, Node.js, Go"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            返回
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;


