/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const UserIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CalendarIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const HeartIcon = ({ filled, ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="22" height="22"
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const SendIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // ✅ Blog data fetch karo (views increment NAHI hoga yahan ab)
    fetch(`${import.meta.env.VITE_API_URL}/blogs/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setBlog(null);
        } else {
          setBlog(data);
          setLikesCount(data.likes || 0);
          setComments(data.comments || []);
          setViewsCount(data.views || 0);

          // ✅ Views — sirf ek baar per user per blog count karo
          const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs") || "[]");

          if (!viewedBlogs.includes(data._id)) {
            // Pehli baar dekh raha hai — view increment karo
            fetch(`${import.meta.env.VITE_API_URL}/blogs/slug/${slug}/view`, {
              method: "POST",
            })
              .then((res) => res.json())
              .then((viewData) => {
                if (viewData.views !== undefined) {
                  setViewsCount(viewData.views);
                }
              })
              .catch(() => {});

            // localStorage mein save karo
            viewedBlogs.push(data._id);
            localStorage.setItem("viewedBlogs", JSON.stringify(viewedBlogs));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
    if (likedBlogs.includes(slug)) setLiked(true);

    fetch(`${import.meta.env.VITE_API_URL}/blogs`)
      .then((res) => res.json())
      .then((data) => setRecentPosts(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => {});
  }, [slug]);

  const handleLike = async () => {
    if (liked || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/slug/${slug}/like`,
        { method: "POST" }
      );
      const data = await res.json();
      if (res.ok) {
        setLikesCount(data.likes);
        setLiked(true);
        const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
        localStorage.setItem("likedBlogs", JSON.stringify([...likedBlogs, slug]));
      }
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentName.trim() || !commentText.trim()) {
      alert("Please enter your name and comment.");
      return;
    }
    setCommentLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs/slug/${slug}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: commentName.trim(), text: commentText.trim() }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setCommentName("");
        setCommentText("");
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <p className="text-gray-600">The blog post you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Navbar />

      <div className="relative h-[500px] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/1200x600/A7F3D0/065F46?text=Blog+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-16">
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeIcon className="w-5 h-5" />
                {/* ✅ viewsCount state use karo — real-time updated */}
                <span>{viewsCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
              <div className="text-xl text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-200 italic">
                {blog.excerpt}
              </div>
              <div className="prose prose-lg max-w-none">
                {Array.isArray(blog.blocks) && blog.blocks.length > 0 ? (
                  blog.blocks.map((block, index) => (
                    <div key={index} className="mb-8">
                      {block.type === "text" && (
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {block.content}
                        </div>
                      )}
                      {block.type === "image" && (
                        <div className="my-8">
                          <img
                            src={block.url}
                            alt={block.caption || "Blog image"}
                            className="w-full rounded-xl shadow-md"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/800x500/A7F3D0/065F46?text=Image";
                            }}
                          />
                          {block.caption && (
                            <p className="text-sm text-gray-500 italic text-center mt-3">
                              {block.caption}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No content available.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6">
              <button
                onClick={handleLike}
                disabled={liked || likeLoading}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 ${
                  liked
                    ? "bg-red-100 text-red-500 cursor-default"
                    : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-500 hover:scale-105 active:scale-95"
                }`}
              >
                <HeartIcon
                  filled={liked}
                  className={`transition-all duration-300 ${
                    liked ? "text-red-500 scale-125" : "text-gray-400"
                  }`}
                />
                <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
              </button>
              {liked && (
                <p className="text-sm text-gray-500 italic">Thanks for liking this post! ❤️</p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                Comments ({comments.length})
              </h3>

              <div className="space-y-6 mb-8">
                {comments.length > 0 ? (
                  comments.map((c, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 font-bold text-sm">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-center py-6">
                    No comments yet. Be the first to comment! 💬
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Leave a Comment</h4>
                {commentSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                    ✅ Comment posted successfully!
                  </div>
                )}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                  />
                  <textarea
                    placeholder="Write your comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition resize-none"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={commentLoading}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-95 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <SendIcon />
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                Recent Posts
              </h3>
              <div className="space-y-6">
                {recentPosts
                  .filter((post) => post._id !== blog._id)
                  .slice(0, 4)
                  .map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/200x200/A7F3D0/065F46?text=Blog";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;