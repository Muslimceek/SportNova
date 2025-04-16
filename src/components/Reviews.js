// ... existing imports ...

const Reviews = ({ reviews }) => {
  // Ensure reviews is always an array
  const safeReviews = Array.isArray(reviews) 
    ? reviews.filter(review => 
        review && 
        typeof review === 'object' &&
        review.author &&
        review.text &&
        typeof review.rating === 'number'
      )
    : [];

  if (!reviews) {
    return <p>Загрузка отзывов...</p>;
  }

  if (safeReviews.length === 0) {
    return <p>Пока нет отзывов. Будьте первым!</p>;
  }

  return (
    <div className="space-y-4">
      {safeReviews.map((review, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-bold">{review.author}</h3>
          <p>{review.text}</p>
          <div className="text-yellow-400">
            {'★'.repeat(review.rating)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;