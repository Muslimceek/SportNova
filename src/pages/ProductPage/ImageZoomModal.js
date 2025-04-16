import React, { useState, useEffect } from "react";

const ImageZoomModal = ({ product, selectedColor, setShowImageZoom }) => {
  // Получаем основное изображение и дополнительные изображения по выбранному цвету
  const mainImage =
    (product.imagesByColor && product.imagesByColor[selectedColor]) ||
    product.image;
  const additionalImages =
    (product.additionalImagesByColor &&
      product.additionalImagesByColor[selectedColor]) ||
    [];

  const [activeImage, setActiveImage] = useState(mainImage);

  useEffect(() => {
    setActiveImage(mainImage);
  }, [selectedColor, mainImage]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden">
        <button
          onClick={() => setShowImageZoom(false)}
          className="absolute top-4 right-4 text-black text-3xl font-bold z-10"
        >
          &times;
        </button>
        <div className="p-4">
          <img
            src={activeImage}
            alt={product.name}
            className="object-contain w-full max-h-[80vh]"
          />
        </div>
        {additionalImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto p-4 bg-gray-100">
            {[mainImage, ...additionalImages].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} - дополнительный вид ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                onMouseEnter={() => setActiveImage(img)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageZoomModal;