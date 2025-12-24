// src/components/ForumReplyPage.jsx
import { ForumReplyCard } from "./ForumReplyCard";
import { ForumReplyForm } from "./ForumReplyForm";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ThumbsUp, MessageSquare, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

// ✅ Use environment variable for API
const API = import.meta.env.VITE_API_URL;

export const ForumReplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forumTopic, setForumTopic] = useState({});
  const [forumReply, setForumReply] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Add new reply to state
  const addReply = (reply) => {
    setForumReply((prevReplies) => [...prevReplies, reply]);
  };

  // Check if user liked the topic
  useEffect(() => {
    const checkLike = async () => {
      try {
        const response = await fetch(`${API}/api/v1/forum/checklike?topic_id=${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) setIsLiked(true);
      } catch (error) {
        console.log(error);
      }
    };
    checkLike();
  }, [id]);

  // Fetch like count
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await fetch(`${API}/api/v1/forum/like-count?topic_id=${id}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) setLikeCount(data.likeCount);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLikeCount();
  }, [id]);

  // Fetch forum topic & replies
  const fetchForumData = async () => {
    try {
      const response = await fetch(`${API}/api/v1/forum/${id}`, { credentials: "include" });
      const data = await response.json();
      if (data.success) {
        const { title, description, category, created_at, author, replies } = data.forumDiscussion;
        setForumTopic({ title, description, category, created_at, author });
        setForumReply(replies || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchForumData();
  }, [id]);

  // Handle like/unlike for topic
  const handleLike = async () => {
    try {
      if (!isLiked) {
        const response = await fetch(`${API}/api/v1/forum/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic_id: id }),
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) setLikeCount((count) => count + 1);
      } else {
        const response = await fetch(`${API}/api/v1/forum/dislike?topic_id=${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) setLikeCount((count) => count - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/ForumsPage")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Back to forums</span>
            </button>
            <div>
              <p className="bg-black text-sm text-white px-3 py-1 rounded-xl inline-block">
                {forumTopic.category}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
                {forumTopic.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Main Topic Card */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md duration-300 mb-8">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="hidden sm:block flex-shrink-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-14 h-14 flex items-center justify-center shadow-sm">
                    <span className="text-indigo-700 font-bold text-lg">
                      {forumTopic.author?.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3.5 h-3.5 border-2 border-white"></div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="sm:hidden flex-shrink-0">
                      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-indigo-700 font-bold">
                          {forumTopic.author?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {forumTopic.author?.full_name}
                        </h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          {forumTopic.author?.major}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center flex-wrap">
                        <span>Joined {formatDate(forumTopic.author?.created_at)}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <ThumbsUp size={14} className="mr-1" /> {likeCount} likes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 flex items-center">
                    <span>{formatDate(forumTopic.created_at)}</span>
                    <button className="ml-3 p-1.5 hover:bg-gray-100 rounded-full">
                      <Bookmark size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Topic Content */}
                <div className="prose max-w-none mb-6">
                  {forumTopic.description ? (
                    <div
                      className="min-h-[200px] bg-white p-4 space-y-2
                      [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-black
                      [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-black
                      [&_p]:text-base
                      [&_ul]:list-disc [&_ul]:pl-5
                      [&_ol]:list-decimal [&_ol]:pl-5
                      [&_li]:mb-1
                      [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:border-gray-400
                      [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(forumTopic.description),
                      }}
                    />
                  ) : (
                    <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isLiked ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-100"
                      }`}
                      aria-pressed={isLiked}
                    >
                      <ThumbsUp size={20} className={isLiked ? "fill-indigo-500" : ""} />
                      <span className="font-medium">
                        {isLiked ? "Liked" : "Like"} • {likeCount}
                      </span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200">
                      <MessageSquare size={20} />
                      <span className="font-medium">Reply • {forumReply.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
              Replies <span className="text-indigo-600">({forumReply.length})</span>
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <span>Sort by:</span>
              <select className="ml-2 bg-transparent border-0 focus:ring-0">
                <option>Newest first</option>
                <option>Most liked</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {forumReply.length > 0 ? (
              forumReply.map((reply) => (
                <ForumReplyCard
                  key={reply.id}
                  reply={reply}
                  onDelete={() =>
                    setForumReply((prev) => prev.filter((r) => r.id !== reply.id))
                  }
                />
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No replies yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Be the first to share your thoughts on this topic. Your reply could help others in the community!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        <ForumReplyForm topic_id={id} onNewReply={addReply} />
      </div>
    </div>
  );
};
