import React, { useState } from "react";

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "/images/ultra-luxury.jpeg";

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = "Hotel Newlands Shimla",
  fallbackSrc = DEFAULT_FALLBACK,
  className = "",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-black/5 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-black/10" />
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
};
