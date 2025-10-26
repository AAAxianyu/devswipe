import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black relative">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
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
              <span className="text-white font-semibold text-xl">CodeCrush</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link 
                to="/login" 
                className="bg-white/[0.1] backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2 rounded-xl hover:bg-white/[0.15] transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.4)]"
              >
                登录
              </Link>
              <Link 
                to="/register" 
                className="bg-white/[0.1] backdrop-blur-sm border border-white/[0.2] text-white px-4 py-2 rounded-xl hover:bg-white/[0.15] transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.4)]"
              >
                注册
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-liquid-flow"
            style={{
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl animate-liquid-flow"
            style={{
              borderRadius: '40% 60% 70% 30% / 50% 60% 30% 70%',
              animationDelay: '4s'
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-3xl animate-float"
            style={{
              borderRadius: '70% 30% 50% 50% / 30% 50% 60% 70%'
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CodeCrush
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            一个生产级的开发者项目展示平台。发现、分享和连接优秀的开发项目。
          </motion.p>
          
          {/* Code-style decoration */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] rounded-xl px-4 py-2 font-mono text-sm text-blue-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.1)]">
              <span className="text-blue-400">const</span> codeCrush = <span className="text-cyan-400">'awesome'</span>;
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/app"
              className="bg-white/[0.1] backdrop-blur-sm border border-white/[0.2] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/[0.15] transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
            >
              开始使用
            </Link>
            <Link 
              to="/app"
              className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/[0.1] transition-all duration-300 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]"
            >
              查看项目
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              发现精彩项目
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              探索来自全球开发者的创新项目
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI 聊天机器人",
                description: "基于 GPT-4 的智能聊天应用",
                tech: ["React", "Node.js", "OpenAI"],
                likes: 1247,
                author: "张三"
              },
              {
                title: "区块链钱包",
                description: "安全的多链数字钱包解决方案",
                tech: ["Vue.js", "Solidity", "Web3"],
                likes: 892,
                author: "李四"
              },
              {
                title: "实时协作编辑器",
                description: "支持多人实时编辑的在线文档工具",
                tech: ["React", "Socket.io", "MongoDB"],
                likes: 1563,
                author: "王五"
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] rounded-3xl p-6 hover:bg-white/[0.08] transition-all duration-300 group shadow-[0_8px_32px_0_rgba(59,130,246,0.1)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-white/60">
                    <span>❤️</span>
                    <span className="text-sm">{project.likes}</span>
                  </div>
                </div>
                <p className="text-white/70 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-white/[0.1] backdrop-blur-sm border border-white/[0.1] text-blue-300 text-sm rounded-full shadow-[0_4px_16px_0_rgba(59,130,246,0.1)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">by {project.author}</span>
                  <motion.button
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    查看详情 →
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              为什么选择 CodeCrush？
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              我们为开发者打造了一个现代化、高性能的项目展示平台
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "简单易用",
                description: "直观的界面设计，让项目展示变得简单而有趣",
                icon: "🎯"
              },
              {
                title: "高性能",
                description: "基于现代技术栈构建，确保流畅的用户体验",
                icon: "⚡"
              },
              {
                title: "社区驱动",
                description: "连接全球开发者，分享创意和最佳实践",
                icon: "🌍"
              },
              {
                title: "实时互动",
                description: "点赞、评论、分享，与项目作者实时互动",
                icon: "💬"
              },
              {
                title: "智能推荐",
                description: "AI 驱动的推荐系统，发现你感兴趣的项目",
                icon: "🤖"
              },
              {
                title: "开源友好",
                description: "支持开源项目展示，促进技术社区发展",
                icon: "🔓"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] rounded-3xl p-8 hover:bg-white/[0.08] transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.1)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
              className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.1] rounded-3xl p-12 shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              准备开始你的项目之旅？
            </h2>
            <p className="text-xl text-white/80 mb-8">
              加入数千名开发者，展示你的创意项目，发现新的灵感
            </p>
            <Link 
              to="/register"
              className="inline-block bg-white/[0.1] backdrop-blur-sm border border-white/[0.2] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/[0.15] transition-all duration-300 shadow-[0_8px_32px_0_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
            >
              立即注册
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 lg:px-8 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2 mb-4 md:mb-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/[0.1] rounded-xl flex items-center justify-center relative shadow-[0_8px_32px_0_rgba(59,130,246,0.3)]">
                <span className="text-white font-bold text-sm relative z-10">CC</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl animate-glass-shimmer" 
                     style={{
                       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                       backgroundSize: '200% 100%'
                     }}></div>
              </div>
              <span className="text-white font-semibold text-xl">CodeCrush</span>
            </motion.div>
            
            <motion.div 
              className="flex space-x-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <button className="text-white/60 hover:text-white transition-colors duration-200">
                关于我们
              </button>
              <button className="text-white/60 hover:text-white transition-colors duration-200">
                帮助中心
              </button>
              <button className="text-white/60 hover:text-white transition-colors duration-200">
                隐私政策
              </button>
              <button className="text-white/60 hover:text-white transition-colors duration-200">
                服务条款
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-8 pt-8 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-white/60">
              © 2024 CodeCrush. 保留所有权利。
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
