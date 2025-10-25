import React from 'react';
import { motion } from 'motion/react';
import { Eye, Heart, MessageCircle } from 'lucide-react';
import { Project } from '../../types';

interface ProjectDashboardProps {
  onProjectClick: (project: Project) => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ onProjectClick }) => {
  // Mock 项目数据
  const mockProjects: Project[] = [
    {
      id: 1,
      user_id: 1,
      title: 'AI 驱动的代码审查工具',
      description: '使用 GPT-4 和静态分析技术，自动检测代码中的潜在问题，提供智能修复建议。支持多种编程语言，集成到 CI/CD 流程中。',
      cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
      image_urls: [],
      project_url: 'https://github.com/example/ai-code-review',
      status: 'launched',
      view_count: 3456,
      like_count: 892,
      dislike_count: 12,
      super_like_count: 45,
      skip_count: 234,
      comment_count: 156,
      completion_rate: 95,
      is_public: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:20:00Z',
      user: {
        id: 1,
        username: 'TechExplorer',
        email: 'tech@example.com',
        tech_stack: 'React,TypeScript,Python',
        is_creator: true,
        follower_count: 1234,
        following_count: 567,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-01-20T00:00:00Z',
      },
      tags: [
        { id: 1, project_id: 1, tag_name: 'AI', tag_type: 'tech', created_at: '2024-01-15T10:30:00Z' },
        { id: 2, project_id: 1, tag_name: 'Python', tag_type: 'tech', created_at: '2024-01-15T10:30:00Z' },
        { id: 3, project_id: 1, tag_name: 'DevTools', tag_type: 'domain', created_at: '2024-01-15T10:30:00Z' },
      ],
    },
    {
      id: 2,
      user_id: 1,
      title: '实时协作白板应用',
      description: '基于 WebSocket 的实时协作白板，支持多人同时绘制、文字输入、图片上传。完美适用于远程团队头脑风暴和设计讨论。',
      cover_image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&h=600&fit=crop',
      image_urls: [],
      project_url: 'https://github.com/example/realtime-whiteboard',
      status: 'mvp',
      view_count: 2145,
      like_count: 567,
      dislike_count: 8,
      super_like_count: 23,
      skip_count: 156,
      comment_count: 89,
      completion_rate: 80,
      is_public: true,
      created_at: '2024-02-01T08:15:00Z',
      updated_at: '2024-02-10T16:45:00Z',
      user: {
        id: 1,
        username: 'TechExplorer',
        email: 'tech@example.com',
        tech_stack: 'React,TypeScript,Go',
        is_creator: true,
        follower_count: 1234,
        following_count: 567,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-02-10T00:00:00Z',
      },
      tags: [
        { id: 4, project_id: 2, tag_name: 'React', tag_type: 'tech', created_at: '2024-02-01T08:15:00Z' },
        { id: 5, project_id: 2, tag_name: 'WebSocket', tag_type: 'tech', created_at: '2024-02-01T08:15:00Z' },
        { id: 6, project_id: 2, tag_name: 'Collaboration', tag_type: 'function', created_at: '2024-02-01T08:15:00Z' },
      ],
    },
    {
      id: 3,
      user_id: 1,
      title: '智能健身追踪器',
      description: '结合计算机视觉和机器学习，通过摄像头实时分析用户的健身动作，提供姿势矫正建议和运动数据统计。',
      cover_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      image_urls: [],
      project_url: 'https://github.com/example/fitness-tracker',
      status: 'demo',
      view_count: 1823,
      like_count: 423,
      dislike_count: 15,
      super_like_count: 18,
      skip_count: 98,
      comment_count: 67,
      completion_rate: 60,
      is_public: true,
      created_at: '2024-02-15T12:00:00Z',
      updated_at: '2024-02-20T09:30:00Z',
      user: {
        id: 1,
        username: 'TechExplorer',
        email: 'tech@example.com',
        tech_stack: 'Python,TensorFlow,React',
        is_creator: true,
        follower_count: 1234,
        following_count: 567,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-02-20T00:00:00Z',
      },
      tags: [
        { id: 7, project_id: 3, tag_name: 'AI', tag_type: 'tech', created_at: '2024-02-15T12:00:00Z' },
        { id: 8, project_id: 3, tag_name: 'Computer Vision', tag_type: 'tech', created_at: '2024-02-15T12:00:00Z' },
        { id: 9, project_id: 3, tag_name: 'Health', tag_type: 'domain', created_at: '2024-02-15T12:00:00Z' },
      ],
    },
    {
      id: 4,
      user_id: 1,
      title: '区块链投票系统',
      description: '基于以太坊智能合约的去中心化投票平台，确保投票过程的透明性和不可篡改性。适用于各类组织的民主决策。',
      cover_image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop',
      image_urls: [],
      project_url: 'https://github.com/example/blockchain-voting',
      status: 'concept',
      view_count: 1234,
      like_count: 298,
      dislike_count: 23,
      super_like_count: 12,
      skip_count: 76,
      comment_count: 45,
      completion_rate: 35,
      is_public: true,
      created_at: '2024-03-01T15:20:00Z',
      updated_at: '2024-03-05T11:10:00Z',
      user: {
        id: 1,
        username: 'TechExplorer',
        email: 'tech@example.com',
        tech_stack: 'Solidity,Web3.js,React',
        is_creator: true,
        follower_count: 1234,
        following_count: 567,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-03-05T00:00:00Z',
      },
      tags: [
        { id: 10, project_id: 4, tag_name: 'Blockchain', tag_type: 'tech', created_at: '2024-03-01T15:20:00Z' },
        { id: 11, project_id: 4, tag_name: 'Ethereum', tag_type: 'tech', created_at: '2024-03-01T15:20:00Z' },
        { id: 12, project_id: 4, tag_name: 'Governance', tag_type: 'domain', created_at: '2024-03-01T15:20:00Z' },
      ],
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      concept: { text: '概念', color: 'from-gray-500/20 to-slate-500/20 border-gray-400/30' },
      demo: { text: 'Demo', color: 'from-yellow-500/20 to-amber-500/20 border-yellow-400/30' },
      mvp: { text: 'MVP', color: 'from-orange-500/20 to-red-500/20 border-orange-400/30' },
      launched: { text: '已上线', color: 'from-green-500/20 to-emerald-500/20 border-green-400/30' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.concept;

    return (
      <span className={`px-2 py-1 bg-gradient-to-r ${config.color} backdrop-blur-sm border rounded-full text-xs text-white/90`}>
        {config.text}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">我的项目</h1>
        <p className="text-white/60">共 {mockProjects.length} 个项目</p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl overflow-hidden cursor-pointer group shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-[1.02]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            onClick={() => onProjectClick(project)}
          >
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-3 right-3">
                {getStatusBadge(project.status)}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-white/70 mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-white/[0.1] border border-white/[0.15] rounded-md text-xs text-white/80"
                  >
                    {tag.tag_name}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{project.view_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{project.like_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{project.comment_count}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDashboard;

