import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  user: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  tags: Array<{
    id: number;
    tag_name: string;
    tag_type: string;
  }>;
  status: string;
  stats?: {
    like_count: number;
    view_count: number;
    comment_count: number;
  };
}

interface Comment {
  id: number;
  user: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  content: string;
  created_at: string;
}

interface PostDetailModalProps {
  post: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose
}) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: {
        id: 1,
        username: "Alice",
        avatar_url: undefined
      },
      content: "这个项目看起来很有趣！技术栈选择很现代化。",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      user: {
        id: 2,
        username: "Bob",
        avatar_url: undefined
      },
      content: "UI设计很棒，用户体验应该会很好。期待看到更多功能！",
      created_at: "2024-01-15T14:20:00Z"
    }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concept': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'demo': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'mvp': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'launched': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concept': return '概念';
      case 'demo': return '演示';
      case 'mvp': return 'MVP';
      case 'launched': return '已发布';
      default: return status;
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: {
          id: 999,
          username: "当前用户",
          avatar_url: undefined
        },
        content: newComment.trim(),
        created_at: new Date().toISOString()
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}小时前`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}天前`;
    }
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-[90vw] h-[90vh] max-w-7xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex h-full">
              {/* 左侧：媒体内容 */}
              <div className="flex-1 relative bg-black/20">
                {post.mediaType === 'image' ? (
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={post.mediaUrl}
                    className="w-full h-full object-cover"
                    controls
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onClick={handleVideoClick}
                  />
                )}

                {/* 状态标签 */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusColor(post.status)}`}>
                    {getStatusText(post.status)}
                  </span>
                </div>

                {/* 视频播放进度条 */}
                {post.mediaType === 'video' && videoRef.current && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300"
                        style={{
                          width: `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 右侧：详细信息 */}
              <div className="w-[400px] flex flex-col bg-white/[0.02] backdrop-blur-sm border-l border-white/10">
                {/* 用户信息 */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    {post.user.avatar_url ? (
                      <img
                        src={post.user.avatar_url}
                        alt={post.user.username}
                        className="w-12 h-12 rounded-full border border-white/20"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {post.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-white font-semibold text-lg">
                        {post.user.username}
                      </div>
                      <div className="text-white/60 text-sm">
                        发布者
                      </div>
                    </div>
                  </div>
                </div>

                {/* 帖子内容 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* 标题 */}
                  <div>
                    <h2 className="text-white text-2xl font-bold mb-2">
                      {post.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 text-sm rounded-full"
                        >
                          #{tag.tag_name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 描述 */}
                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-2">项目描述</h3>
                    <p className="text-white/90 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  {/* 统计信息 */}
                  {post.stats && (
                    <div>
                      <h3 className="text-white/80 text-sm font-medium mb-3">互动数据</h3>
                      <div className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="text-white/80">{post.stats.like_count}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-white/80">{post.stats.comment_count}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-white/80">{post.stats.view_count}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 评论区 */}
                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-4">评论 ({comments.length})</h3>

                    {/* 评论列表 */}
                    <div className="space-y-4 mb-6">
                      {comments.map(comment => (
                        <div key={comment.id} className="flex space-x-3">
                          {comment.user.avatar_url ? (
                            <img
                              src={comment.user.avatar_url}
                              alt={comment.user.username}
                              className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-medium text-xs">
                                {comment.user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-medium text-sm">
                                {comment.user.username}
                              </span>
                              <span className="text-white/50 text-xs">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 评论输入框 */}
                    <form onSubmit={handleCommentSubmit} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium text-xs">我</span>
                      </div>
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="添加评论..."
                        className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-300"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newComment.trim()}
                      >
                        发送
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostDetailModal;