import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, Heart, MessageCircle, ExternalLink, Calendar, TrendingUp, Zap, BarChart3, Cloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Project } from '../../types';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

// Mock 数据生成
const generateChartData = () => {
  const data = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      likes: Math.floor(Math.random() * 50) + 30 + i * 2,
      dislikes: Math.floor(Math.random() * 10) + 2,
      views: Math.floor(Math.random() * 200) + 150 + i * 5,
    });
  }
  return data;
};

const mockComments = [
  {
    id: 1,
    username: 'TechEnthusiast',
    avatarUrl: '',
    content: '这个项目的设计思路很新颖，代码质量也很高！UI 设计非常精美，期待后续更新。技术栈选择很合理，代码规范很好。',
    createdAt: '2024-10-23 15:30',
    likes: 24,
  },
  {
    id: 2,
    username: 'CodeMaster',
    avatarUrl: '',
    content: '非常棒的项目！架构设计很清晰，代码可读性强。希望能看到更多功能的实现。性能优化做得很好，代码质量很高。',
    createdAt: '2024-10-22 10:15',
    likes: 18,
  },
  {
    id: 3,
    username: 'DevExplorer',
    avatarUrl: '',
    content: '很有创意的想法，实现也很优雅。用户体验很流畅，交互设计考虑周到。技术实现很专业，代码写得很好。',
    createdAt: '2024-10-21 18:45',
    likes: 15,
  },
  {
    id: 4,
    username: 'WebWizard',
    avatarUrl: '',
    content: '优秀的开源项目！文档写得很详细，代码注释清晰。对新手很友好，学到了很多东西。项目很好。',
    createdAt: '2024-10-20 14:20',
    likes: 12,
  },
  {
    id: 5,
    username: 'FrontendFan',
    avatarUrl: '',
    content: '界面设计很现代，动画效果流畅自然。响应式布局做得很好，移动端体验也很棒。代码规范值得学习，设计很棒。',
    createdAt: '2024-10-19 09:30',
    likes: 20,
  },
  {
    id: 6,
    username: 'AIEngineer',
    avatarUrl: '',
    content: '项目的 AI 集成做得很出色，算法设计合理。代码实现很专业，性能表现优异。技术栈选择很好，值得学习。',
    createdAt: '2024-10-18 16:20',
    likes: 16,
  },
  {
    id: 7,
    username: 'FullStackDev',
    avatarUrl: '',
    content: '前后端分离做得很好，API 设计规范。数据库设计合理，代码质量很高。整体架构设计很清晰，很好的项目。',
    createdAt: '2024-10-17 11:45',
    likes: 14,
  },
  {
    id: 8,
    username: 'UXDesigner',
    avatarUrl: '',
    content: '用户体验设计非常出色，交互流畅自然。视觉设计很现代，色彩搭配协调。整体设计感很好，值得称赞。',
    createdAt: '2024-10-16 14:30',
    likes: 22,
  },
  {
    id: 9,
    username: 'BackendGuru',
    avatarUrl: '',
    content: '后端架构设计很好，代码组织清晰。性能优化到位，数据库查询效率高。技术实现专业，代码质量优秀。',
    createdAt: '2024-10-15 10:00',
    likes: 19,
  },
  {
    id: 10,
    username: 'OpenSourceFan',
    avatarUrl: '',
    content: '非常好的开源项目，代码质量高，文档完善。对社区贡献很大，学习价值很高。项目很有意义，设计很好。',
    createdAt: '2024-10-14 17:15',
    likes: 21,
  },
  {
    id: 11,
    username: 'MobileDev',
    avatarUrl: '',
    content: '移动端适配做得很好，响应式设计优秀。性能优化到位，用户体验流畅。代码实现很专业，设计很棒。',
    createdAt: '2024-10-13 13:40',
    likes: 17,
  },
  {
    id: 12,
    username: 'SecurityExpert',
    avatarUrl: '',
    content: '安全性考虑周全，代码规范严谨。权限控制做得很好，数据加密处理得当。整体安全设计很专业，值得学习。',
    createdAt: '2024-10-12 09:25',
    likes: 13,
  },
  {
    id: 13,
    username: 'DataScientist',
    avatarUrl: '',
    content: '数据分析功能很强大，算法设计合理。可视化效果很好，用户体验优秀。技术实现专业，代码质量高。',
    createdAt: '2024-10-11 15:50',
    likes: 15,
  },
  {
    id: 14,
    username: 'CloudArchitect',
    avatarUrl: '',
    content: '云部署架构设计得很好，扩展性强。容器化做得很专业，CI/CD 流程完善。整体设计很好，代码质量优秀。',
    createdAt: '2024-10-10 11:30',
    likes: 18,
  },
  {
    id: 15,
    username: 'QAEngineer',
    avatarUrl: '',
    content: '测试覆盖率很高，代码质量有保障。Bug 很少，稳定性很好。整体质量控制做得很专业，项目很好。',
    createdAt: '2024-10-09 08:15',
    likes: 11,
  },
];

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const chartData = useMemo(() => generateChartData(), []);

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

  // 词云数据生成
  const wordCloudData = useMemo(() => {
    // 从评论中提取关键词
    const allText = mockComments.map(c => c.content).join(' ');

    // 简单的中文分词和统计
    const words = allText.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    const wordCount: { [key: string]: number } = {};

    words.forEach(word => {
      if (word.length >= 2) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    // 转换为数组并排序
    const wordArray = Object.entries(wordCount)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return wordArray;
  }, []);

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

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-slate-900/95 border border-white/[0.15] rounded-lg p-3 shadow-lg">
          <p className="text-white/80 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          className="relative w-full max-w-5xl max-h-[90vh] backdrop-blur-xl bg-gradient-to-br from-slate-900/95 to-black/95 border border-white/[0.15] rounded-3xl shadow-[0_20px_80px_0_rgba(59,130,246,0.4)] overflow-hidden"
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

              {/* Data Trend Chart */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  数据趋势分析（最近14天）
                </h3>
                <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.6)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.6)"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ color: 'rgba(255, 255, 255, 0.8)', paddingTop: '10px' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#06B6D4"
                        strokeWidth={2}
                        dot={{ fill: '#06B6D4', r: 3 }}
                        activeDot={{ r: 5 }}
                        name="浏览量"
                      />
                      <Line
                        type="monotone"
                        dataKey="likes"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', r: 3 }}
                        activeDot={{ r: 5 }}
                        name="喜欢"
                      />
                      <Line
                        type="monotone"
                        dataKey="dislikes"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={{ fill: '#EF4444', r: 3 }}
                        activeDot={{ r: 5 }}
                        name="不喜欢"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  项目描述
                </h3>
                <p className="text-white/80 leading-relaxed">{project.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">技术栈</h3>
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
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">项目链接</h3>
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

              {/* Comment Word Cloud */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  评论词云分析
                </h3>
                <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-6">
                  <div className="flex flex-wrap gap-3 justify-center items-center min-h-[200px]">
                    {wordCloudData.map((item, index) => {
                      const maxCount = Math.max(...wordCloudData.map(w => w.count));
                      const minCount = Math.min(...wordCloudData.map(w => w.count));
                      // 计算归一化的频率比例 (0-1)
                      const scale = minCount === maxCount ? 1 : (item.count - minCount) / (maxCount - minCount);
                      // 字体大小范围：12px - 48px，让高频词更突出
                      const fontSize = 12 + scale * 36;
                      // 透明度范围：0.6 - 1.0
                      const opacity = 0.6 + scale * 0.4;

                      // 随机颜色变化
                      const colors = [
                        'from-blue-400 to-cyan-400',
                        'from-cyan-400 to-teal-400',
                        'from-blue-500 to-blue-300',
                        'from-cyan-500 to-cyan-300',
                      ];
                      const colorClass = colors[index % colors.length];

                      return (
                        <motion.span
                          key={item.word}
                          className={`bg-gradient-to-r ${colorClass} bg-clip-text text-transparent font-bold cursor-default hover:scale-110 transition-transform`}
                          style={{
                            fontSize: `${fontSize}px`,
                            opacity: opacity,
                          }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: opacity, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          title={`出现 ${item.count} 次`}
                        >
                          {item.word}
                        </motion.span>
                      );
                    })}
                  </div>
                  <p className="text-center text-white/40 text-xs mt-4">
                    基于 {mockComments.length} 条评论的关键词分析
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  项目评论 ({mockComments.length})
                </h3>
                <div className="backdrop-blur-sm bg-white/[0.05] border border-white/[0.1] rounded-xl p-6">
                  <div className="space-y-4">
                    {mockComments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        className="bg-white/[0.03] rounded-lg p-4 hover:bg-white/[0.05] transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center border border-white/[0.15]">
                            <span className="text-white text-sm font-medium">
                              {comment.username.charAt(0)}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="text-white font-semibold text-sm">{comment.username}</span>
                                <span className="text-white/40 text-xs ml-2">{comment.createdAt}</span>
                              </div>
                              <div className="flex items-center gap-1 text-white/60 text-xs">
                                <Heart className="w-3 h-3" />
                                <span>{comment.likes}</span>
                              </div>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

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
