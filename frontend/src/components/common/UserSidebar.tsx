import React from 'react';
import { motion } from 'motion/react';
import { User, Settings, Edit3 } from 'lucide-react';

const UserSidebar: React.FC = () => {
  // Mock 用户数据
  const mockUser = {
    username: 'TechExplorer',
    bio: '热爱技术，喜欢探索新事物。专注于全栈开发和 AI 应用。',
    avatarUrl: '',
    techStack: ['React', 'TypeScript', 'Go', 'Python', 'Docker'],
    followerCount: 1234,
    followingCount: 567,
    projectCount: 12,
  };

  return (
    <motion.div
      className="backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(59,130,246,0.25)]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* 用户头像 */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border-2 border-white/[0.2] flex items-center justify-center shadow-[0_8px_32px_0_rgba(59,130,246,0.4)]">
            <User className="w-12 h-12 text-white/80" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500/80 to-emerald-500/80 rounded-full border-2 border-black flex items-center justify-center">
            <span className="text-xs text-white">✓</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{mockUser.username}</h2>
        <p className="text-sm text-white/60 text-center">{mockUser.bio}</p>
      </div>

      {/* 技术栈标签 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white/80 mb-3">技术栈</h3>
        <div className="flex flex-wrap gap-2">
          {mockUser.techStack.map((tech, index) => (
            <motion.span
              key={tech}
              className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] rounded-full text-xs text-white/90"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>

      {/* 统计数据 */}
      <div className="mb-6 p-4 bg-white/[0.05] rounded-xl border border-white/[0.1]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{mockUser.projectCount}</div>
            <div className="text-xs text-white/60">项目</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{mockUser.followerCount}</div>
            <div className="text-xs text-white/60">粉丝</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{mockUser.followingCount}</div>
            <div className="text-xs text-white/60">关注</div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2.5 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 shadow-[0_4px_16px_0_rgba(59,130,246,0.3)] hover:shadow-[0_4px_16px_0_rgba(59,130,246,0.5)]">
          <Edit3 className="w-4 h-4" />
          <span className="text-sm font-medium">编辑资料</span>
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] text-white/90 px-4 py-2.5 rounded-xl hover:bg-white/[0.12] transition-all duration-300">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">设置</span>
        </button>
      </div>
    </motion.div>
  );
};

export default UserSidebar;

