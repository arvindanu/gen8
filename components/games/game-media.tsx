
"use client";

import { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
} from "lucide-react";

interface Screenshot {
  image_id: string;
}

interface GameMediaProps {
  screenshots: Screenshot[];
  videoId?: string;
  gameName: string;
}

function getImageUrl(imageId: string) {
  return `https://images.igdb.com/igdb/image/upload/t_1080p/${imageId}.jpg`;
}

export default function GameMedia({
  screenshots,
  videoId,
  gameName,
}: GameMediaProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeViewer = () => setActiveIndex(null);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + screenshots.length) % screenshots.length
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current + 1) % screenshots.length
    );
  };

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  return (
    <div className="space-y-10">
      {/* Screenshot gallery */}
      {screenshots.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-[#f13b43]" />
            <div>
              <h2 className="text-xl font-bold text-[#202024]">
                Screenshots
              </h2>
              <p className="mt-1 text-xs text-[#85858d]">
                Explore {gameName} in action
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {screenshots.slice(0, 8).map((screenshot, index) => (
              <button
                key={`${screenshot.image_id}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View screenshot ${index + 1}`}
                className="group relative aspect-video overflow-hidden rounded-xl border border-[#e9e9ec] bg-[#ededf0] text-left"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${getImageUrl(
                      screenshot.image_id
                    )}")`,
                  }}
                />

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                <div className="absolute bottom-3 right-3 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  View image
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Trailer */}
      {videoId && (
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="h-7 w-1 rounded-full bg-[#f13b43]" />
            <div>
              <h2 className="text-xl font-bold text-[#202024]">
                Official trailer
              </h2>
              <p className="mt-1 text-xs text-[#85858d]">
                Watch the game in action
              </p>
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#e9e9ec] bg-[#111114]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                videoId
              )}`}
              title={`${gameName} official trailer`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Empty state */}
      {screenshots.length === 0 && !videoId && (
        <div className="rounded-2xl border border-dashed border-[#dedee2] bg-white px-5 py-12 text-center">
          <ImageIcon className="mx-auto text-[#b7b7be]" size={32} />
          <p className="mt-3 text-sm text-[#85858d]">
            Game screenshots and trailers are not currently available.
          </p>
        </div>
      )}

      {/* Fullscreen screenshot viewer */}
      {activeIndex !== null && screenshots[activeIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${gameName} screenshot viewer`}
          onClick={closeViewer}
        >
          <button
            type="button"
            onClick={closeViewer}
            aria-label="Close screenshot viewer"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous screenshot"
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-8"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="w-full flex-1 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${getImageUrl(
                  screenshots[activeIndex].image_id
                )}")`,
              }}
            />

            <p className="mt-4 text-sm text-white/65">
              {gameName} · {activeIndex + 1} / {screenshots.length}
            </p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next screenshot"
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-8"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
