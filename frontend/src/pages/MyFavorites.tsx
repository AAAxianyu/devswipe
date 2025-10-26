import React from 'react';
import ProjectCard from '../components/project/ProjectCard';
import { Project } from '../types';
import DarkHeader from '../components/common/DarkHeader';
import { motion } from 'framer-motion';

const MOCK_PROJECTS: Project[] = [
  {
    id: 101,
    user_id: 1,
    title: '示例项目：AI 协作平台',
    description: '一个示例项目，用于展示我的收藏页面的样式和布局。',
    cover_image: '',
    image_urls: ['https://picsum.photos/seed/ai/800/600'],
    project_url: 'https://example.com',
    status: 'demo',
    view_count: 120,
    like_count: 45,
    dislike_count: 2,
    super_like_count: 5,
    skip_count: 0,
    comment_count: 8,
    completion_rate: 0.6,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 1,
      username: 'alice',
      email: 'alice@example.com',
      tech_stack: 'react,go',
      is_creator: true,
      follower_count: 10,
      following_count: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    tags: [
      { id: 1, project_id: 101, tag_name: 'AI', tag_type: 'tech', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 102,
    user_id: 2,
    title: '示例项目：开源工具合集',
    description: '另一条示例收藏项目。',
    cover_image: '',
    image_urls: ['https://picsum.photos/seed/oss/800/600'],
    project_url: '',
    status: 'concept',
    view_count: 80,
    like_count: 20,
    dislike_count: 0,
    super_like_count: 1,
    skip_count: 0,
    comment_count: 3,
    completion_rate: 0.2,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 2,
      username: 'bob',
      email: 'bob@example.com',
      tech_stack: 'go, docker',
      is_creator: false,
      follower_count: 5,
      following_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    tags: []
  }
];

const MyFavorites = () => {
  const handleSwipe = (direction: any) => {
    console.log('swipe', direction);
  };

  const handleBookmark = (projectId: number) => {
    console.log('bookmark clicked', projectId);
    alert(`收藏/取消收藏（示例）: ${projectId}`);
  };

  const handleComment = (projectId: number) => {
    console.log('comment for', projectId);
    alert(`评论（示例）: ${projectId}`);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-slate-900 to-black relative overflow-hidden">
      <DarkHeader />
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl animate-liquid-flow"
          style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
          }}
        />
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blur-3xl animate-liquid-flow"
          style={{
            borderRadius: '40% 60% 70% 30% / 50% 60% 30% 70%',
            animationDelay: '4s'
          }}
        />
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 blur-3xl animate-float"
          style={{
            borderRadius: '70% 30% 50% 50% / 30% 50% 60% 70%'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24">
        <motion.div
          className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 mb-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">我的收藏</h2>
          <p className="text-white/80">您收藏的精选项目展示</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          {MOCK_PROJECTS.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onSwipe={handleSwipe}
              onBookmark={handleBookmark}
              onComment={handleComment}
              currentIndex={0}
              totalCount={MOCK_PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFavorites;
