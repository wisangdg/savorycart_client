import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../../styles/optimized-image.css";

/**
 * OptimizedImage component with lazy loading, placeholder, and responsive features
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for the image
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.sizes - Responsive sizes configuration
 * @param {string} props.placeholderColor - Background color for placeholder
 * @param {number} props.aspectRatio - Aspect ratio for the image container
 * @param {string} props.objectFit - CSS object-fit property
 * @param {Function} props.onLoad - Callback when image is loaded
 * @param {Function} props.onError - Callback when image fails to load
 * @returns {JSX.Element} OptimizedImage component
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  sizes = {
    sm: 400,
    md: 600,
    lg: 800,
    xl: 1200,
  },
  placeholderColor = "#f0f0f0",
  aspectRatio = 1.5, // Default 3:2 aspect ratio
  objectFit = "cover",
  onLoad,
  onError,
  retryCount = 3,
  retryDelay = 500, // ms antara percobaan
  errorDelay = 3000, // tunda tampil error definitif (ms)
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false); // hanya true setelah seluruh retry + errorDelay
  const [imageSrc, setImageSrc] = useState("");
  const [webpSupported, setWebpSupported] = useState(false);
  const attemptsRef = useRef(0);
  const baseSrcRef = useRef("");
  const originalSrcRef = useRef(src);
  const fallbackTriedRef = useRef(false);
  const errorTimerRef = useRef(null);
  const retryTimerRef = useRef(null);

  // helper untuk menambahkan query params dengan aman (memastikan gunakan ? atau &)
  const appendParams = (url, paramString) => {
    if (!paramString) return url;
    return url + (url.includes("?") ? "&" : "?") + paramString;
  };

  // Check WebP support
  useEffect(() => {
    const checkWebpSupport = async () => {
      try {
        const webpData =
          "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
        const blob = await fetch(webpData).then((r) => r.blob());
        setWebpSupported(blob.size > 0);
      } catch (e) {
        setWebpSupported(false);
      }
    };

    checkWebpSupport();
  }, []);

  // Prepare image URL with size and format parameters
  useEffect(() => {
    if (!src) return;
    originalSrcRef.current = src; // simpan original
    attemptsRef.current = 0; // reset saat src berubah
    fallbackTriedRef.current = false;
    setIsLoaded(false);
    setIsError(false);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

    // Bentuk URL dasar (tanpa query runtime) untuk reuse saat retry
    let prepared;
    if (src.includes("/images/products/")) {
      const baseUrl = src.split("?")[0];
      const format = webpSupported ? "webp" : "jpg";
      const viewportWidth = window.innerWidth;
      const width =
        viewportWidth < 768
          ? sizes.sm
          : viewportWidth < 1024
          ? sizes.md
          : viewportWidth < 1440
          ? sizes.lg
          : sizes.xl;
      prepared = appendParams(baseUrl, `format=${format}&width=${width}`);
    } else {
      // hapus cache params lama untuk base
      prepared = src.split("?")[0];
    }
    baseSrcRef.current = prepared;
    // Tambahkan cache-buster kecil untuk memaksa fetch baru awal
    setImageSrc(appendParams(prepared, `cb=${Date.now()}`));
  }, [src, webpSupported, sizes.sm, sizes.md, sizes.lg, sizes.xl]);

  const handleImageLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    if (onError) onError(e);

    // Jika masih ada jatah retry, coba lagi tanpa langsung mengubah state error
    if (attemptsRef.current < retryCount) {
      attemptsRef.current += 1;
      retryTimerRef.current = setTimeout(() => {
        // Gunakan baseSrc + cache buster baru agar tidak pakai cache error
        setImageSrc(
          appendParams(
            baseSrcRef.current,
            `rt=${attemptsRef.current}&cb=${Date.now()}`
          )
        );
      }, retryDelay * attemptsRef.current); // sedikit meningkat tiap percobaan
      return; // jangan set error dulu
    }

    // Fallback terakhir: coba original src (tanpa parameter) satu kali jika berbeda
    if (
      !fallbackTriedRef.current &&
      baseSrcRef.current !== originalSrcRef.current
    ) {
      fallbackTriedRef.current = true;
      setImageSrc(
        appendParams(originalSrcRef.current.split("?")[0], `cb=${Date.now()}`)
      );
      return;
    }

    // Sudah melewati semua retry + fallback, tunda tampil error agar UX lebih halus
    if (!isError) {
      errorTimerRef.current = setTimeout(() => {
        setIsError(true);
      }, errorDelay);
    }
  };

  // Cleanup timers saat unmount
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  // Calculate padding based on aspect ratio to prevent layout shift
  const paddingBottom = `${(1 / aspectRatio) * 100}%`;

  return (
    <div
      className={`optimized-image-container ${className}`}
      style={{
        paddingBottom,
        backgroundColor: placeholderColor,
      }}
      data-loaded={isLoaded}
      data-error={isError}
    >
      {!isLoaded && !isError && (
        <div className="image-placeholder pulse">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
              fill="currentColor"
            />
            <path
              d="M21 15L16 10L5 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {isError && (
        <div className="image-error">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 9L9 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Failed to load image</span>
        </div>
      )}

      <img
        key={imageSrc} // paksa re-render img pada setiap retry
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          opacity: isLoaded ? 1 : 0,
          objectFit,
        }}
        data-attempt={attemptsRef.current}
        {...props}
      />
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  sizes: PropTypes.shape({
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number,
  }),
  placeholderColor: PropTypes.string,
  aspectRatio: PropTypes.number,
  objectFit: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  retryCount: PropTypes.number,
  retryDelay: PropTypes.number,
  errorDelay: PropTypes.number,
};

export default OptimizedImage;
