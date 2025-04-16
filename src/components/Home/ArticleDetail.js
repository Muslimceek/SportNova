import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Share2, Heart, Bookmark, MessageSquare } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const fetchArticle = async (id) => {
  const res = await fetch(`${API_URL}/api/articles/${id}`);
  if (!res.ok) throw new Error("Ошибка загрузки статьи");
  return res.json();
};

const fetchRelatedArticles = async (currentId) => {
  const res = await fetch(`${API_URL}/api/articles?exclude=${currentId}&limit=3`);
  if (!res.ok) throw new Error("Ошибка загрузки похожих статей");
  return res.json();
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [articleData, relatedData] = await Promise.all([fetchArticle(id), fetchRelatedArticles(id)]);
        setArticle(articleData);
        setRelatedArticles(relatedData);
        setViewCount(articleData.views || 0);
        setLikeCount(articleData.likes || 0);
        setIsLiked(JSON.parse(localStorage.getItem("likedArticles") || "[]").includes(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      const response = await fetch(`${API_URL}/api/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId: id, action: isLiked ? "unlike" : "like" }),
      });
      if (!response.ok) throw new Error("Не удалось обновить лайк");
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");
      localStorage.setItem(
        "likedArticles",
        JSON.stringify(isLiked ? likedArticles.filter((item) => item !== id) : [...likedArticles, id])
      );
    } catch (error) {
      console.error("Ошибка при обновлении лайка:", error);
      alert("Не удалось обновить лайк. Пожалуйста, попробуйте позже.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = () => setIsBookmarked((prev) => !prev);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Ссылка скопирована в буфер обмена");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error || !article)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`p-8 rounded-full mb-6 ${error ? "bg-red-500/20" : "bg-gray-500/20"}`}
        >
          <div className="text-5xl">{error ? "⚠️" : "🔍"}</div>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{error || "Статья не найдена"}</h2>
        <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors">
          Вернуться на главную
        </Link>
      </div>
    );

  const paragraphs = article.content.split("\n\n");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-sans">
      <section className="relative h-screen max-h-[80vh] w-full overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
        <motion.img
          src={article.image || "https://source.unsplash.com/random/1600x900/?fitness"}
          alt={article.title}
          className="w-full h-full object-cover object-center"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 z-20 p-6 lg:p-10"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/80">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">{article.section}</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👁️ {viewCount} просмотров</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">{article.title}</h1>
            {article.description && <p className="text-xl text-white/80 max-w-3xl">{article.description}</p>}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="absolute top-6 left-6 z-20">
          <Link
            to="/"
            className="flex items-center gap-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад</span>
          </Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="absolute top-6 right-6 z-20 flex gap-3">
          <button
            onClick={handleShare}
            className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors"
            aria-label="Поделиться"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
              isBookmarked ? "bg-blue-500/80 text-white" : "bg-black/50 hover:bg-black/70"
            }`}
            aria-label={isBookmarked ? "Удалить из закладок" : "Добавить в закладки"}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`p-2 backdrop-blur-sm rounded-full transition-colors flex items-center gap-1 ${
              isLiked ? "bg-red-500/80 text-white" : "bg-black/50 hover:bg-black/70"
            } ${likeLoading && "opacity-70 cursor-not-allowed"}`}
            aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
          >
            <Heart className={`w-5 h-5 ${isLiked && "fill-current"}`} />
            {likeCount > 0 && <span className="text-xs font-medium">{likeCount}</span>}
          </button>
        </motion.div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-invert prose-lg max-w-none">
            <AnimatePresence>
              {paragraphs.map((para, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.4 }}
                  className="mb-8 last:mb-0"
                >
                  {para.split("\n").map((line, lineIdx) => (
                    <p key={lineIdx} className={lineIdx > 0 ? "mt-4" : ""}>
                      {line}
                    </p>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </article>

          {article.tags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-2"
            >
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/articles?tag=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                {article.author?.avatar ? (
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl">{article.author?.name?.charAt(0) || "A"}</span>
                )}
              </div>
              <div>
                <h3 className="font-medium">{article.author?.name || "Администратор"}</h3>
                <p className="text-sm text-white/60">{article.author?.role || "Автор статьи"}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>Оставить комментарий</span>
            </button>
          </motion.div>
        </div>
      </main>

      {relatedArticles.length > 0 && (
        <section className="bg-gradient-to-b from-black/50 to-gray-900/50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-12"
            >
              Похожие статьи
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {relatedArticles.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-2xl shadow-xl"
                  >
                    <Link to={`/articles/${item.id}`} className="block h-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
                      <img
                        src={item.image || "https://source.unsplash.com/random/600x400/?sport"}
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-medium rounded-full bg-white/10 backdrop-blur-sm">
                          {item.section}
                        </span>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{item.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ArticleDetail;
