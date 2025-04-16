import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import Header from "./Header";
import ProductImage from "./ProductImage";
import ProductDetails from "./ProductDetails";
import RelatedProducts from "./RelatedProducts";
import SizeGuideModal from "./SizeGuideModal";
import ImageZoomModal from "./ImageZoomModal";
import ReviewSection from "./ReviewSection";
import Breadcrumbs from "../../components/Breadcrumbs";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return navigate("/");
    (async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data);
        setSelectedSize(data.options?.sizes?.[0] || null);
        setSelectedColor(data.options?.colors?.[0] || "");
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/");
      }
    })();
  }, [id, navigate]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Загрузка...</h2>
    </div>
  );

  if (!product) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Товар не найден</h2>
    </div>
  );

  const selectedVariant = product.pricing?.variants?.find(
    variant => variant.color === selectedColor && variant.size === selectedSize
  );
  const productPrice = selectedVariant?.price || product.pricing?.basePrice || product.pricing?.minPrice || "Не указана";

  const handleShare = platform => alert(`Поделиться через ${platform}`);
  const handleAddToWishlist = () => setIsWishlisted(prev => !prev);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
        <Breadcrumbs />
      </div>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-10 space-y-8 md:space-y-10">
          {/* Product section - stacked on mobile, grid on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <ProductImage
                product={product}
                selectedColor={selectedColor}
                handleShare={handleShare}
                isWishlisted={isWishlisted}
                handleAddToWishlist={handleAddToWishlist}
                setShowImageZoom={setShowImageZoom}
              />
            </div>
            <div className="lg:col-span-1 mt-6 lg:mt-0">
              <ProductDetails
                product={product}
                productPrice={productPrice}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                quantity={quantity}
                setQuantity={setQuantity}
                addToCart={addToCart}
                setShowSizeGuide={setShowSizeGuide}
              />
            </div>
          </div>
          
          {/* Review section with improved mobile spacing */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <ReviewSection productId={product.id} />
          </div>
          
          {/* Related products section with improved mobile spacing */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <RelatedProducts
              currentProductId={product.id}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              addToCart={addToCart}
            />
          </div>
        </div>
      </main>
      {showSizeGuide && <SizeGuideModal setShowSizeGuide={setShowSizeGuide} />}
      {showImageZoom && (
        <ImageZoomModal
          product={product}
          selectedColor={selectedColor}
          setShowImageZoom={setShowImageZoom}
        />
      )}
    </div>
  );
};

export default ProductPage;
