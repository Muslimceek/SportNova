import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for blog posts (in a real app, this would come from an API)
const blogPostsData = {
  'gym-progress-mistakes': {
    id: 1,
    title: '5 причин, почему ты всё ещё не добился прогресса в зале',
    image: '/images/blog-1.jpg',
    date: '02 апреля 2025',
    category: '🏋️‍♂️ Тренировки',
    author: 'Алексей Петров',
    authorImage: '/images/author-1.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Многие из нас приходят в зал с большими надеждами и амбициями. Мы представляем, как через несколько месяцев будем выглядеть совершенно иначе — сильнее, стройнее, увереннее. Но проходит время, а результаты не соответствуют ожиданиям. Почему так происходит?'
      },
      {
        type: 'heading',
        text: '1. Отсутствие конкретного плана'
      },
      {
        type: 'paragraph',
        text: 'Одна из самых распространенных ошибок — тренировки без четкого плана. Случайный набор упражнений, которые вы делаете по настроению, никогда не даст таких результатов, как структурированная программа.'
      },
      {
        type: 'quote',
        text: 'Если вы не знаете, куда идете, вы никогда туда не попадете.'
      },
      {
        type: 'paragraph',
        text: 'Решение: найдите готовую программу тренировок, соответствующую вашим целям, или обратитесь к тренеру для составления индивидуального плана. Записывайте свои тренировки и отслеживайте прогресс.'
      },
      {
        type: 'heading',
        text: '2. Недостаточная интенсивность'
      },
      {
        type: 'paragraph',
        text: 'Комфортные тренировки редко приводят к значительным результатам. Если вы можете свободно разговаривать во время выполнения упражнений или не чувствуете мышечного напряжения, вероятно, вы работаете недостаточно интенсивно.'
      },
      {
        type: 'paragraph',
        text: 'Решение: постепенно увеличивайте нагрузку. Используйте принцип прогрессивной перегрузки — регулярно повышайте вес, количество повторений или сокращайте время отдыха между подходами.'
      },
      {
        type: 'image',
        url: '/images/blog-1-content-1.jpg',
        caption: 'Правильная техника приседаний с прогрессивным увеличением нагрузки'
      },
      {
        type: 'heading',
        text: '3. Непоследовательность и пропуски тренировок'
      },
      {
        type: 'paragraph',
        text: 'Регулярность — ключ к успеху. Даже идеальная программа тренировок не даст результатов, если вы занимаетесь от случая к случаю.'
      },
      {
        type: 'paragraph',
        text: 'Решение: составьте реалистичный график тренировок и придерживайтесь его. Лучше тренироваться 3 раза в неделю без пропусков, чем планировать 6 тренировок, но постоянно их пропускать.'
      },
      {
        type: 'heading',
        text: '4. Игнорирование питания'
      },
      {
        type: 'paragraph',
        text: 'Невозможно перетренировать плохое питание. Если ваш рацион не соответствует вашим целям, прогресс будет минимальным.'
      },
      {
        type: 'paragraph',
        text: 'Решение: скорректируйте свой рацион в соответствии с целями. Для набора мышечной массы необходим небольшой профицит калорий и достаточное количество белка (1.6-2.2 г на кг веса). Для похудения — умеренный дефицит калорий с сохранением высокого потребления белка.'
      },
      {
        type: 'heading',
        text: '5. Недостаточное восстановление'
      },
      {
        type: 'paragraph',
        text: 'Мышцы растут не во время тренировки, а во время отдыха. Недостаток сна и постоянный стресс негативно влияют на восстановление и гормональный фон.'
      },
      {
        type: 'paragraph',
        text: 'Решение: обеспечьте себе 7-9 часов качественного сна. Включите в расписание дни активного восстановления (легкая кардионагрузка, растяжка) и полного отдыха. Используйте техники управления стрессом — медитацию, дыхательные практики.'
      },
      {
        type: 'conclusion',
        text: 'Прогресс в тренировках — это не только о том, что вы делаете в зале, но и о вашем подходе к тренировкам, питанию и восстановлению. Исправьте эти 5 распространенных ошибок, и вы увидите, как результаты не заставят себя ждать.'
      }
    ],
    relatedPosts: [2, 3]
  },
  'gym-shoes-guide': {
    id: 2,
    title: 'Как выбрать кроссовки для зала: гид от экспертов SportNova',
    image: '/images/blog-2.jpg',
    date: '29 марта 2025',
    category: '🎽 Экипировка',
    author: 'Мария Соколова',
    authorImage: '/images/author-2.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Правильная обувь — это не просто вопрос комфорта, но и безопасности, эффективности тренировок и даже прогресса. В этой статье мы расскажем, как выбрать идеальные кроссовки для различных типов тренировок.'
      },
      // Добавьте больше контента по аналогии с первой статьей
    ],
    relatedPosts: [1, 3]
  },
  'pre-post-workout-meals': {
    id: 3,
    title: 'Что есть до и после тренировки? Примеры рационов на каждый день',
    image: '/images/blog-3.jpg',
    date: '27 марта 2025',
    category: '🍽️ Питание',
    author: 'Дмитрий Волков',
    authorImage: '/images/author-3.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Питание до и после тренировки играет ключевую роль в вашем прогрессе, восстановлении и общих результатах. Давайте разберемся, что, когда и почему стоит есть, чтобы максимизировать эффект от тренировок.'
      },
      // Добавьте больше контента по аналогии с первой статьей
    ],
    relatedPosts: [1, 2]
  }
};

// Content renderer component
const ContentRenderer = ({ content }) => {
  return content.map((item, index) => {
    switch (item.type) {
      case 'paragraph':
        return <p key={index} className="text-lg text-gray-700 mb-6 leading-relaxed">{item.text}</p>;
      case 'heading':
        return <h3 key={index} className="text-2xl font-bold mb-4 mt-10 text-gray-900 relative before:content-[''] before:absolute before:w-12 before:h-1 before:bg-red-500 before:-bottom-2 before:left-0">{item.text}</h3>;
      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-red-500 pl-6 italic my-10 text-xl text-gray-700 py-2 bg-gray-50 rounded-r-lg shadow-sm">
            {item.text}
          </blockquote>
        );
      case 'image':
        return (
          <figure key={index} className="my-10">
            <img src={item.url} alt={item.caption} className="w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300" />
            {item.caption && <figcaption className="text-center text-gray-500 mt-3 italic">{item.caption}</figcaption>}
          </figure>
        );
      case 'conclusion':
        return (
          <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl my-10 border-l-4 border-red-500 shadow-sm">
            <p className="text-lg font-medium">{item.text}</p>
          </div>
        );
      default:
        return null;
    }
  });
};

// Related post card component
const RelatedPostCard = ({ id, title, image, category }) => {
  const slug = Object.keys(blogPostsData).find(key => blogPostsData[key].id === id);
  
  return (
    <Link to={`/blog/${slug}`} className="group block">
      <div className="overflow-hidden rounded-xl mb-3 shadow-md hover:shadow-lg transition-all duration-300">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <span className="inline-block text-sm font-medium text-white mb-2 bg-red-500 px-3 py-1 rounded-full">{category}</span>
      <h4 className="font-bold text-lg group-hover:text-red-500 transition-colors">{title}</h4>
    </Link>
  );
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      if (blogPostsData[slug]) {
        setPost(blogPostsData[slug]);
        setLoading(false);
      } else {
        setError('Статья не найдена');
        setLoading(false);
      }
    }, 500);
    
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/4 mb-12"></div>
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-8"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{error}</h1>
        <p className="text-lg text-gray-600 mb-8">Запрашиваемая статья не найдена или была удалена.</p>
        <Link 
          to="/blog" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-1 active:translate-y-0 active:shadow-inner"
        >
          <svg className="w-5 h-5 mr-2 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Вернуться к блогу
        </Link>
      </div>
    );
  }

  if (!post) return null;

  const relatedPosts = post.relatedPosts
    .map(id => {
      const slug = Object.keys(blogPostsData).find(key => blogPostsData[key].id === id);
      return blogPostsData[slug];
    })
    .filter(Boolean);

  return (
    <motion.main 
      className="pt-16 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero section */}
      <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 py-16 mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center text-gray-600 hover:text-red-500 mb-8 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад к блогу
            </Link>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {post.title}
          </motion.h1>
          
          <motion.div 
            className="flex items-center mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img 
              src={post.authorImage} 
              alt={post.author} 
              className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white shadow-md"
            />
            <div>
              <span className="block text-gray-900 font-medium">{post.author}</span>
              <div className="flex items-center text-sm text-gray-500">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span className="text-red-500">{post.category}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Featured image */}
      <motion.div 
        className="max-w-5xl mx-auto px-6 mb-16"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="aspect-[16/9] overflow-hidden rounded-2xl shadow-xl">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </motion.div>
      
      {/* Content */}
      <motion.article 
        className="max-w-3xl mx-auto px-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <ContentRenderer content={post.content} />
        
        {/* Share buttons */}
        <div className="border-t border-b border-gray-200 py-8 my-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <span className="font-medium text-gray-900">Поделиться статьей:</span>
            <div className="flex space-x-5">
              <button className="text-gray-500 hover:text-blue-600 transition-colors transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-blue-400 transition-colors transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-green-500 transition-colors transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 110-3.096 1.548 1.548 0 010 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-pink-500 transition-colors transform hover:scale-110">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.article>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <motion.div 
          className="max-w-5xl mx-auto px-6 mt-20"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-10 relative inline-block">
            Похожие статьи
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-red-500"></span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map(post => (
              <RelatedPostCard 
                key={post.id}
                id={post.id}
                title={post.title}
                image={post.image}
                category={post.category}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Newsletter */}
      <motion.div 
        className="max-w-4xl mx-auto px-6 mt-24"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl py-12 px-8 text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-white">📬 Понравилась статья? Подпишись на обновления</h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Получай новые статьи, советы по тренировкам и питанию прямо на почту
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input 
              type="email" 
              placeholder="Ваш email" 
              className="flex-1 px-4 py-3 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/40 transform hover:-translate-y-1 active:translate-y-0 active:shadow-inner border border-red-400/20"
            >
              Подписаться
            </button>
          </form>
        </div>
      </motion.div>
    </motion.main>
  );
};

export default BlogPost;