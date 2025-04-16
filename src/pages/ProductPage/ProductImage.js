import React, { useState, useMemo, useEffect } from "react";
const ProductImage = ({
product,
selectedColor,
handleShare,
isWishlisted,
handleAddToWishlist,
setShowImageZoom,
}) => {
const theme = { background: "bg-neutral-100", shareButton: "hover:bg-black hover:text-white" };
const mainImg = product.media?.imagesByColor?.[selectedColor] || product.media?.fallbackImage;
const additional = useMemo(
() => product.media?.additionalImagesByColor?.[selectedColor] || [],
[product.media?.additionalImagesByColor, selectedColor]
);
const allImages = useMemo(() => (Array.isArray(mainImg) ? mainImg : [mainImg, ...additional]), [mainImg,
additional]);
const [active, setActive] = useState(allImages[0] || "");
const [index, setIndex] = useState(0);
useEffect(() => {
const imgs = Array.isArray(mainImg) ? mainImg : [mainImg, ...additional];
setActive(imgs[0]);
setIndex(0);
}, [selectedColor, mainImg, additional]);
const next = () => {
const nextIdx = (index + 1) % allImages.length;
setIndex(nextIdx);
setActive(allImages[nextIdx]);
};
const prev = () => {
const prevIdx = (index - 1 + allImages.length) % allImages.length;
setIndex(prevIdx);
setActive(allImages[prevIdx]);
};
const renderThumbnails = (className) => (
<div className={className}>
{allImages.map((img, i) => (
<div
key={i}
onMouseEnter={() => { setActive(img); setIndex(i); }}
className={`w-full h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
active === img ? "border-black scale-105": "border-transparent hover:border-gray-300"
}`}
>
<img src={img} alt={`Thumbnail ${i + 1}`} className="object-cover w-full h-full transition-transform hover:scale-110" />
</div>
))}
</div>
);
return (
<div className="flex flex-col md:flex-row gap-6 p-4 bg-white">
<div>
{renderThumbnails("hidden md:block md:h-[480px] md:w-24 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-4")}
{renderThumbnails("flex md:hidden overflow-x-auto gap-2 mb-4 custom-scrollbar")}
</div>
<div className="flex-1 relative group">
<div className="relative overflow-hidden rounded-2xl shadow-lg">
<img
src={active}
alt={product.name?.ru || "Product Image"}
onClick={() => setShowImageZoom(true)}
className="w-full h-auto object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
/>
{allImages.length > 1 && (
<div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
<button
onClick={prev}
className="bg-white/70 hover:bg-white rounded-full w-10 h-10 ml-4 shadow-md flex items-center justify-center"
aria-label="Previous Image"
>
<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
</svg>
</button>
<button
onClick={next}
className="bg-white/70 hover:bg-white rounded-full w-10 h-10 mr-4 shadow-md flex items-center justify-center"
aria-label="Next Image"
>
<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
</svg>
</button>
</div>
)}
</div>
<div className="mt-4 flex justify-between items-center">
<div className="flex space-x-2">
{["Facebook", "Twitter", "Instagram"].map((platform) => (
<button
key={platform}
onClick={() => handleShare(platform)}
className={`p-2 rounded-full border ${theme.shareButton} transition-all duration-300`}
aria-label={`Share on ${platform}`}
>
<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
{platform === "Facebook" && <path d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 011-1h3z" />}
{platform === "Twitter" && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />}
{platform === "Instagram" && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />}
</svg>
</button>
))}
</div>
<button
onClick={handleAddToWishlist}
className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
isWishlisted ? "bg-black text-white" : "bg-white text-black border border-gray-300 hover:border-black"
}`}
>
<svg className={`w-5 h-5 ${isWishlisted ? "fill-current" : "stroke-current"}`} viewBox="0 0 24 24">
{isWishlisted ? (
<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
) : (
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
)}
</svg>
<span>{isWishlisted ? "Added to Favorites" : "Add to Favorites"}</span>
</button>
</div>
</div>
</div>
);
};
export default ProductImage;