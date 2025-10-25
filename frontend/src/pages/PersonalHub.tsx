import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/common/UserSidebar';
import ProjectDashboard from '../components/common/ProjectDashboard';
import ProjectDetailModal from '../components/common/ProjectDetailModal';
import { Project } from '../types';

const PersonalHub: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Liquid Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-liquid-flow"
          style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          }}
        />
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl animate-liquid-flow"
          style={{
            borderRadius: '40% 60% 70% 30% / 50% 60% 30% 70%',
            animationDelay: '4s'
          }}
        />
        <div
          className="absolute bottom-20 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-3xl animate-float"
          style={{
            borderRadius: '70% 30% 50% 50% / 30% 50% 60% 70%'
          }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/app')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.1] rounded-xl flex items-center justify-center relative shadow-[0_8px_32px_0_rgba(59,130,246,0.3)]">
                <span className="text-white font-bold text-sm relative z-10">DS</span>
              </div>
              <span className="text-white font-semibold text-xl">DevSwipe</span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <button
                onClick={() => navigate('/app')}
                className="text-white/80 hover:text-white transition-colors duration-200"
              >
                返回滑动
              </button>
              <button
                onClick={() => navigate('/publish')}
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.5)]"
              >
                发布项目
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="flex flex-col lg:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <UserSidebar />
            </div>

            {/* Right Dashboard */}
            <div className="flex-1">
              <ProjectDashboard onProjectClick={handleProjectClick} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PersonalHub;

