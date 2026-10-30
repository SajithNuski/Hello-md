"use client";

import { useState, useEffect } from "react";
import { FiImage } from "react-icons/fi";

interface SafeMarkdownImageProps {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  align?: string;
}

export function SafeMarkdownImage({
  src,
  alt = "",
  width,
  height,
  className = "",
  style = {},
  align,
}: SafeMarkdownImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }

    // Reset status when src changes
    setStatus("loading");

    const img = new Image();
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      setStatus("loaded");
      return;
    }

    img.onload = () => {
      setStatus("loaded");
    };

    img.onerror = () => {
      setStatus("error");
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (!src) return null;

  const isFullWidth = width === "100%" || className.includes("w-full");
  const isCentered = align === "center" || className.includes("mx-auto");

  // Determine estimated height for layout stability
  let minHeight = 24;
  if (isFullWidth || src.includes("capsule-render")) {
    minHeight = 140;
  } else if (src.includes("github-readme-stats") || src.includes("streak-stats")) {
    minHeight = 120;
  } else if (src.includes("skillicons")) {
    minHeight = 44;
  } else if (src.includes("readme-typing-svg")) {
    minHeight = 32;
  }

  return (
    <span
      className={`inline-block relative ${isFullWidth ? "w-full block my-2" : "mr-1.5 my-1"} ${
        isCentered ? "mx-auto text-center block" : ""
      }`}
      style={{
        ...(isFullWidth ? { width: "100%" } : {}),
      }}
    >
      {/* Skeleton while loading */}
      {status === "loading" && (
        <span
          className={`animate-pulse rounded bg-[#161B22]/80 border border-[#30363D]/40 inline-flex items-center justify-center text-[10px] font-mono text-[#8B949E] ${
            isFullWidth ? "w-full flex" : "inline-flex px-3"
          }`}
          style={{
            height: height ? `${height}px` : `${minHeight}px`,
            minHeight: `${minHeight}px`,
            width: isFullWidth ? "100%" : width ? `${width}px` : undefined,
          }}
          aria-hidden="true"
        >
          <span className="opacity-60 flex items-center gap-1.5">
            <FiImage className="w-3.5 h-3.5 animate-spin" />
            <span className="truncate max-w-[140px]">{alt || "Loading asset..."}</span>
          </span>
        </span>
      )}

      {/* Clean Fallback when image fails or rates out */}
      {status === "error" && (
        <span
          className={`rounded bg-[#161B22] border border-[#30363D] text-[#8B949E] inline-flex items-center justify-center gap-1.5 text-[11px] font-mono px-3 py-1.5 select-none ${
            isFullWidth ? "w-full flex py-4 my-1" : "mr-1 my-0.5"
          }`}
          style={{
            minHeight: isFullWidth ? "72px" : "26px",
          }}
          title={`External image asset could not be loaded: ${alt || src}`}
        >
          <FiImage className="w-3.5 h-3.5 text-[#58A6FF] shrink-0" />
          <span className="truncate max-w-xs">{alt || "External Asset Fallback"}</span>
        </span>
      )}

      {/* Actual Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          ...(isFullWidth ? { width: "100%" } : {}),
          ...(height ? { height: `${height}px` } : {}),
          ...style,
        }}
        className={`${className} ${
          status === "loaded" ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
        } transition-opacity duration-200 max-w-full rounded-xs`}
        loading="lazy"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </span>
  );
}
