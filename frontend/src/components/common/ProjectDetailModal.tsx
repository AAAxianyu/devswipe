import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, Heart, MessageCircle, ExternalLink, Calendar, TrendingUp, Zap } from 'lucide-react';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  // 阻止背景滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      concept: { text: '概念阶段', color: 'from-gray-500/30 to-slate-500/30 border-gray-400/40', icon: '💡' },
      demo: { text: 'Demo 阶段', color: 'from-yellow-500/30 to-amber-500/30 border-yellow-400/40', icon: '🎯' },
      mvp: { text: 'MVP 阶段', color: 'from-orange-500/30 to-red-500/30 border-orange-400/40', icon: '🚀' },
      launched: { text: '已上线', color: 'from-green-500/30 to-emerald-500/30 border-green-400/40', icon: '✨' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.concept;

    return (
      <span className={`px-4 py-2 bg-gradient-to-r ${config.color} backdrop-blur-sm border rounded-xl text-sm text-white font-medium flex items-center gap-2`}>
        <span>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] backdrop-blur-xl bg-gradient-to-br from-slate-900/95 to-black/95 border border-white/[0.15] rounded-3xl shadow-[0_20px_80px_0_rgba(59,130,246,0.4)] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: 'spring' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/[0.1] backdrop-blur-sm border border-white/[0.2] rounded-full hover:bg-white/[0.2] transition-all duration-300 group"
          >
            <X className="w-5 h-5 text-white/80 group-hover:text-white" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
            {/* Cover Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title and Status */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-3xl font-bold text-white flex-1">{project.title}</h2>
                  {getStatusBadge(project.status)}
                </div>

                {/* Author and Date */}
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center text-xs text-white">
                      {project.user.username.charAt(0)}
                    </div>
                    <span>{project.user.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>创建于 {formatDate(project.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-white/60">浏览量</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.view_count.toLocaleString()}</div>
                </div>
                <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-white/60">点赞</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.like_count.toLocaleString()}</div>
                </div>
                <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-white/60">评论</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.comment_count.toLocaleString()}</div>
                </div>
                <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-white/60">超级喜欢</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.super_like_count.toLocaleString()}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  项目描述
                </h3>
                <p className="text-white/80 leading-relaxed">{project.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">技术栈</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] rounded-xl text-sm text-white/90"
                    >
                      {tag.tag_name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project URL */}
              {project.project_url && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">项目链接</h3>
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] rounded-xl text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">访问项目</span>
                  </a>
                </div>
              )}

              {/* Completion Progress */}
              <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">完成度</span>
                  <span className="text-sm font-bold text-white">{project.completion_rate}%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.1] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.completion_rate}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetailModal;

