import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
/**
 * @typedef {Object} BlogPostType
 * @property {number} id
 * @property {string} title
 * @property {string} excerpt
 * @property {string} slug
 * @property {string} image
 * @property {string} date
 * @property {string} category
 */

const CATEGORIES = ['Все', '🏋️‍♂️ Тренировки', '🍽️ Питание', '🎽 Экипировка', '💭 Мотивация', '📢 Новости'];

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Skeleton loader for blog posts
const BlogPostSkeleton = React.memo(() => (
  <motion.div 
    className="rounded-xl bg-white shadow-xl overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
    <div className="p-6">
      <div className="flex items-center mb-2">
        <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded-full ml-3 animate-pulse" />
      </div>
      <div className="h-8 bg-gray-200 rounded mb-3 animate-pulse" />
      <div className="h-20 bg-gray-200 rounded mb-5 animate-pulse" />
      <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
    </div>
  </motion.div>
));

// Blog post card component
const BlogPost = React.memo(({ title, excerpt, slug, image, date, category }) => (
  <motion.article
    className="group relative overflow-hidden rounded-xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
    variants={fadeIn}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    layout
  >
    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center mb-2">
        <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full">{category}</span>
        <span className="text-sm text-gray-500 ml-3">{date}</span>
      </div>
      <h2 className="text-2xl font-bold mb-3 text-gray-900 font-sans">{title}</h2>
      <p className="text-gray-600 mb-5 text-lg leading-relaxed">{excerpt}</p>
      <a
        href={`/blog/${slug}`}
        className="inline-flex items-center text-black font-medium text-lg hover:text-red-500 transition-colors"
      >
        Читать
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  </motion.article>
));

// Category filter component
const CategoryFilter = React.memo(({ categories, activeCategory, onCategoryChange }) => (
  <div className="flex flex-wrap justify-center gap-3 mb-10">
    {categories.map((cat) => (
      <motion.button
        key={cat}
        onClick={() => onCategoryChange(cat)}
        className={`px-4 py-2 rounded-full font-medium transition-colors cursor-pointer ${
          activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {cat}
      </motion.button>
    ))}
  </div>
));

// Newsletter subscription component
const NewsletterSubscription = React.memo(() => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <motion.div 
      className="mt-20 text-center bg-gray-50 rounded-xl py-12 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-2xl font-bold mb-4">📬 Подпишись на обновления</h3>
      <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Будь в курсе свежих статей, акций и гайдов по стилю
      </p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email" 
            disabled={isSubmitting}
            className={`flex-1 px-4 py-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black ${
              status === 'error' ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white font-bold rounded-r-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Отправка...' : 'Подписаться'}
          </button>
        </div>
        
        <AnimatePresence>
          {status === 'error' && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 mt-2 text-sm"
            >
              Пожалуйста, введите корректный email
            </motion.p>
          )}
          
          {status === 'success' && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-green-500 mt-2 text-sm"
            >
              Спасибо! Вы успешно подписались на обновления
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
});

// Main Blog component
const Blog = ({ posts = [], isLoading = false, error = null }) => {
  const [activeCategory, setActiveCategory] = useState('Все');
  
  // Default posts if none provided
  const featuredPosts = [
    {
      id: 1,
      title: '5 причин, почему ты всё ещё не добился прогресса в зале',
      excerpt: 'Ты пашешь в зале, но результат не радует? Мы разобрали главные ошибки и дали конкретные советы — без воды и мотивационных лозунгов.',
      slug: 'gym-progress-mistakes',
      image: '/images/blog-1.jpg',
      date: '02 апреля 2025',
      category: '🏋️‍♂️ Тренировки'
    },
    {
      id: 2,
      title: 'Как выбрать кроссовки для зала: гид от экспертов SportNova',
      excerpt: 'Нет универсальной пары — есть правильный выбор под твою цель. Узнай, какие кроссовки подходят для разных тренировок.',
      slug: 'gym-shoes-guide',
      image: '/images/blog-2.jpg',
      date: '29 марта 2025',
      category: '🎽 Экипировка'
    },
    {
      id: 3,
      title: 'Что есть до и после тренировки? Примеры рационов на каждый день',
      excerpt: 'Мы собрали простые и доступные варианты питания, которые реально работают. Плюс — PDF с меню на неделю.',
      slug: 'pre-post-workout-meals',
      image: '/images/blog-3.jpg',
      date: '27 марта 2025',
      category: '🍽️ Питание'
    }
  ];

  const allPosts = posts.length ? posts : featuredPosts;
  
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'Все') return allPosts;
    return allPosts.filter(post => post.category === activeCategory);
  }, [allPosts, activeCategory]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">🔥 Блог SportNova</h1>
        <h2 className="text-2xl font-medium text-gray-600 mb-6">Прокачай тело и разум вместе с нами</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          SportNova — это не просто магазин, а стиль жизни. В нашем блоге мы делимся мотивацией, советами по тренировкам, новостями индустрии и гидами по выбору экипировки.
        </p>
        
        <CategoryFilter 
          categories={CATEGORIES} 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </motion.div>

      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Произошла ошибка при загрузке статей. Пожалуйста, попробуйте позже.</p>
        </motion.div>
      )}

      <div className="mb-12">
        <h3 className="text-3xl font-bold mb-8">
          {activeCategory === 'Все' ? '📝 Последние статьи' : `📝 ${activeCategory}`}
        </h3>
        
        {isLoading ? (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <BlogPostSkeleton key={i} />)}
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xl text-gray-500">Статьи в этой категории пока отсутствуют</p>
                <button 
                  onClick={() => setActiveCategory('Все')}
                  className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Показать все статьи
                </button>
              </motion.div>
            ) : (
              <motion.div 
                className="grid gap-12 md:grid-cols-2 lg:grid-cols-3"
                layout
              >
                <AnimatePresence>
                  {filteredPosts.map(post => (
                    <BlogPost key={post.id} {...post} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>

      <NewsletterSubscription />
    </main>
  );
};

export default Blog;