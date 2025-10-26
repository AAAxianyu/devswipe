import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DarkHeader = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="fixed top-0 w-full z-50 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.1] rounded-xl flex items-center justify-center relative shadow-[0_8px_32px_0_rgba(59,130,246,0.3)]">
              <span className="text-white font-bold text-sm relative z-10">CC</span>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl animate-glass-shimmer"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  backgroundSize: '200% 100%'
                }}></div>
            </div>
            <span className="text-white font-semibold text-xl cursor-pointer" onClick={() => navigate('/app')}>CodeCrush</span>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              onClick={() => navigate('/publish')}
              className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.5)]"
            >
              发布项目
            </button>
            <button 
              onClick={() => navigate('/favorites')}
              className="text-white/80 hover:text-white transition-colors duration-200"
            >
              我的收藏
            </button>
            <button
              onClick={() => navigate('/personalHub')}
              className="bg-white/[0.1] backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2 rounded-xl hover:bg-white/[0.15] transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.4)]"
            >
              个人中心
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DarkHeader;