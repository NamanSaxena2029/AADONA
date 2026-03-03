/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import bg from '../assets/bg.jpg'; 

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

const ChevronUp = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"></polyline>
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
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Add Tailwind scroll animations
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-down {
        animation: fadeInDown 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    if (!document.querySelector('link[href*="quill"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css";
      document.head.appendChild(link);
    }

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

          const viewedBlogs = JSON.parse(localStorage.getItem("viewedBlogs") || "[]");

          if (!viewedBlogs.includes(data._id)) {
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
      .then((data) =>
        setRecentPosts(Array.isArray(data) ? data.slice(0, 5) : [])
      )
      .catch(() => {});

    const handleScroll = () => {
      setShowScroll(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return null;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
          <p className="text-slate-600 text-xl mb-4">Article Not Found</p>
          <p className="text-slate-500 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link 
            to="/blogs"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-1 transform transition-all"
          >
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white font-sans overflow-x-hidden"
    >
      <Navbar />

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-10 w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full flex items-center justify-center cursor-pointer z-40 shadow-lg hover:shadow-xl transition-all duration-250 ${
          showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* HERO SECTION */}
      <div className="relative h-screen mt-24 overflow-hidden group">
        <div className="absolute inset-0">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            onError={(e) => {
              e.target.src = "https://placehold.co/1920x1080/2d2d2d/ffffff?text=Article";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="w-full px-2 sm:px-3 lg:px-4">
            {blog.category && (
              <div className="mb-6 opacity-0 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-bold text-xs tracking-widest uppercase shadow-lg">
                  {blog.category}
                </span>
              </div>
            )}
      
            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-xl opacity-0 animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 opacity-0 animate-fade-in-down" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all">
                <UserIcon className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium text-sm sm:text-base">{blog.author}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all">
                <CalendarIcon className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium text-sm sm:text-base">{blog.date}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all">
                <ClockIcon className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium text-sm sm:text-base">{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all">
                <EyeIcon className="w-5 h-5 text-green-400" />
                <span className="text-white/90 font-medium text-sm sm:text-base">{viewsCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
       <div
              className="min-h-screen bg-cover bg-center"
              style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              
      <div className="relative bg-transparent">
        <div className="relative w-full px-2 sm:px-3 lg:px-4 py-16 lg:py-24">
          
          {/* Excerpt Card */}
          {blog.excerpt && (
            <div 
              id={`excerpt-${blog._id}`}
              className="mb-8 lg:mb-12 p-5 sm:p-6 lg:p-7 bg-gray-100 border-2 border-green-500 rounded-2xl relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-200 rounded-full opacity-10 blur-2xl pointer-events-none" />
              <p className="relative text-xl lg:text-2xl text-slate-800 italic font-light leading-relaxed">
                "{blog.excerpt}"
              </p>
            </div>
          )}

          {/* Content Blocks */}
          {Array.isArray(blog.blocks) && blog.blocks.length > 0 ? (
            blog.blocks.map((block, index) => (
              <div 
                key={index}
                id={`block-${index}`}
                className="mb-6 lg:mb-8"
              >
                {block.type === "text" && (
                  <div className="p-4 sm:p-5 lg:p-6 bg-gray-100 border-2 border-slate-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all duration-250 group">
                    <div 
                      className="prose prose-lg max-w-none 
                        prose-h1:text-2xl prose-h1:font-black prose-h1:text-slate-900 prose-h1:mb-4 
                        prose-h2:text-xl prose-h2:font-bold prose-h2:text-slate-800 prose-h2:mt-6 prose-h2:mb-3
                        prose-h3:text-lg prose-h3:font-bold prose-h3:text-slate-800 
                        prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base
                        prose-strong:text-green-600 prose-strong:font-bold
                        prose-em:text-slate-600
                        prose-a:text-green-600 prose-a:font-semibold hover:prose-a:text-green-700
                        prose-ul:list-none prose-ul:pl-0
                        prose-li:text-slate-700 prose-li:leading-relaxed prose-li:pl-6 prose-li:relative
                        prose-li:before:absolute prose-li:before:left-0 prose-li:before:text-green-600 prose-li:before:content-['→']
                        prose-ol:list-none prose-ol:pl-0 prose-ol:counter-reset
                        prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:bg-green-50 prose-blockquote:pl-4 prose-blockquote:italic
                      "
                      dangerouslySetInnerHTML={{ __html: block.content }} 
                    />
                  </div>
                )}
                {block.type === "image" && (
                  <div className="overflow-hidden rounded-2xl border-2 border-slate-200 hover:border-green-500 hover:shadow-lg transition-all duration-250 group">
                    <div className="relative h-80 sm:h-96 bg-gray-100 overflow-hidden">
                      <img
                        src={block.url}
                        alt={block.caption || "Article image"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/800x500/2d2d2d/ffffff?text=Image";
                        }}
                      />
                    </div>
                    {block.caption && (
                      <div className="p-3 sm:p-4 bg-gray-100 border-t border-slate-200">
                        <p className="text-center text-slate-600 text-sm italic">{block.caption}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border-2 border-slate-200">
              <p className="text-slate-400 italic">No content available.</p>
            </div>
          )}

          {/* Divider */}
          <div className="my-12 lg:my-16 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200" />
            <span className="text-green-600 text-2xl font-light">◆</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200" />
          </div>

          {/* Like Section */}
          <div 
            id={`like-section`}
            className="mb-12 lg:mb-16 p-5 sm:p-6 lg:p-7 bg-white border-2 border-slate-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all duration-250"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleLike}
                disabled={liked || likeLoading}
                className={`flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold transition-all duration-250 ${
                  liked
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 hover:text-green-600 hover:shadow-lg"
                }`}
              >
                <HeartIcon filled={liked} className={`transition-all duration-300 ${liked ? "scale-125" : ""}`} />
                <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
              </button>
              {liked && (
                <p className="text-green-600 font-semibold text-sm lg:text-base">Thanks for the love! 🎉</p>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div 
            id={`comments-section`}
            className="mt-12 lg:mt-16"
          >

            <h2 className="text-3xl lg:text-3xl font-bold text-green-800 mb-5">Comments</h2>
            {/* Comments List */}
            <div className="space-y-4 mb-8">
              {comments.length > 0 ? (
                comments.map((c, i) => (
                  <div
                    key={i}
                    id={`comment-${i}`}
                    className="p-5 sm:p-6 lg:p-7 bg-white border-2 border-slate-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all duration-250 flex gap-4 items-start"
                  >
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm sm:text-lg">{c.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">{c.name}</span>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 lg:p-12 text-center bg-white border-2 border-dashed border-slate-300 rounded-2xl">
                  <p className="text-slate-500 text-base lg:text-lg font-medium">Be the first to share your thoughts! 💭</p>
                </div>
              )}
            </div>

            {/* Comment Form */}
            <div className="p-5 sm:p-6 lg:p-7 bg-white border-2 border-slate-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all duration-250">
              <h3 className="text-2xl font-bold text-green-800 mb-6">Leave Your Thoughts</h3>

              {commentSuccess && (
                <div className="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-xl font-semibold text-sm flex items-center gap-3 shadow-lg">
                  <span className="text-lg">✓</span>
                  Comment posted successfully! Thank you.
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 lg:px-5 py-3 lg:py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all text-sm lg:text-base"
                />
                <textarea
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={5}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 lg:px-5 py-3 lg:py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 resize-none transition-all text-sm lg:text-base"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={commentLoading}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold hover:shadow-xl disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transform transition-all duration-250 text-sm lg:text-base"
                >
                  {/* <SendIcon /> */}
                  {commentLoading ? "Publishing..." : "Publish Comment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* RECENT POSTS */}
      <div className="w-full px-2 sm:px-3 lg:px-4 py-16 lg:py-20">
        <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-10 lg:mb-12">More Articles to Explore</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {recentPosts
            .filter((post) => post._id !== blog._id)
            .slice(0, 4)
            .map((post, idx) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                id={`recent-post-${idx}`}
                className="group overflow-hidden rounded-2xl border-2 border-slate-200 hover:border-green-500 hover:shadow-lg transition-all duration-250"
              >
                <div className="relative overflow-hidden h-48 sm:h-56 bg-transparent">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x250/2d2d2d/ffffff?text=Article";
                    }}
                  />
                </div>
                <div className="p-5 lg:p-6 bg-white">
                  <h4 className="font-bold text-slate-900 line-clamp-2 group-hover:text-green-600 mb-3 lg:mb-4 transition-colors duration-300 text-base lg:text-lg">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs lg:text-sm text-slate-500 font-medium group-hover:text-green-600 transition-colors duration-300">
                    <CalendarIcon className="w-4 h-4 text-green-500" />
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
</div>

      <Footer />
    </div>
  );
};

export default BlogDetail;