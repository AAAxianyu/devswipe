import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { CreateProjectRequest } from '../../types';

interface ProjectUploadProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProjectUpload: React.FC<ProjectUploadProps> = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CreateProjectRequest>({
    title: '',
    description: '',
    cover_image: '',
    image_urls: [],
    project_url: '',
    status: 'demo',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除相关错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddImageUrl = () => {
    const urlInput = document.getElementById('image-url') as HTMLInputElement;
    if (urlInput.value.trim() && !formData.image_urls.includes(urlInput.value.trim())) {
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, urlInput.value.trim()]
      }));
      urlInput.value = '';
    }
  };

  const handleRemoveImageUrl = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter(url => url !== urlToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '项目名称是必填项';
    }

    if (!formData.description.trim()) {
      newErrors.description = '项目介绍是必填项';
    }

    if (formData.image_urls.length === 0) {
      newErrors.image_urls = '至少需要一张展示图';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await apiService.createProject(formData);
      onSuccess?.();
      navigate('/feed');
    } catch (error: any) {
      console.error('创建项目失败:', error);
      setErrors({
        submit: error.response?.data?.error || '创建项目失败，请重试'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">上传新项目</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 项目名称 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            项目名称 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="输入项目名称"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* 项目介绍 */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            项目介绍 *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="详细介绍你的项目，包括功能特点、技术栈、解决的问题等"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* 项目状态 */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            项目状态
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="concept">概念阶段</option>
            <option value="demo">演示版本</option>
            <option value="mvp">最小可行产品</option>
            <option value="launched">已发布</option>
          </select>
        </div>

        {/* 项目链接 */}
        <div>
          <label htmlFor="project_url" className="block text-sm font-medium text-gray-700 mb-2">
            项目链接
          </label>
          <input
            type="url"
            id="project_url"
            name="project_url"
            value={formData.project_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/username/project"
          />
        </div>

        {/* 封面图 */}
        <div>
          <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-2">
            封面图链接
          </label>
          <input
            type="url"
            id="cover_image"
            name="cover_image"
            value={formData.cover_image}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/cover.jpg"
          />
        </div>

        {/* 展示图片 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            展示图片 *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              id="image-url"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              添加
            </button>
          </div>
          
          {formData.image_urls.length > 0 && (
            <div className="space-y-2">
              {formData.image_urls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">{url}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(url)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {errors.image_urls && <p className="mt-1 text-sm text-red-600">{errors.image_urls}</p>}
        </div>

        {/* 技术标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            技术标签
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入技术标签，如 React, Node.js"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              添加
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 错误信息 */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '创建中...' : '创建项目'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              取消
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectUpload;

