import { useState, useRef, useCallback, useEffect } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.5;

const ImageLightbox = ({ src, alt, children }: ImageLightboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(s + ZOOM_STEP, MAX_SCALE));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(s - ZOOM_STEP, MIN_SCALE);
      if (next === MIN_SCALE) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Scroll wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    },
    [zoomIn, zoomOut]
  );

  // Mouse drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      posStart.current = { ...position };
    },
    [scale, position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({ x: posStart.current.x + dx, y: posStart.current.y + dy });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch drag
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (scale <= 1 || e.touches.length !== 1) return;
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      posStart.current = { ...position };
    },
    [scale, position]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      setPosition({ x: posStart.current.x + dx, y: posStart.current.y + dy });
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Double tap/click to toggle zoom
  const lastTap = useRef(0);
  const handleDoubleAction = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2.5);
      }
    }
    lastTap.current = now;
  }, [scale]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, close, zoomIn, zoomOut]);

  return (
    <>
      {/* Trigger — wraps children and adds cursor hint */}
      <div onClick={open} className="cursor-zoom-in absolute inset-0 group">
        {children}
        {/* Zoom hint icon */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-background/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
        </div>
      </div>

      {/* Lightbox overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && scale <= 1) close();
          }}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 z-[110] flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              className="w-10 h-10 bg-card/80 backdrop-blur-sm border border-accent/20 rounded-full flex items-center justify-center text-foreground hover:text-accent hover:border-accent/50 transition-all disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-foreground/70 text-xs font-mono min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              className="w-10 h-10 bg-card/80 backdrop-blur-sm border border-accent/20 rounded-full flex items-center justify-center text-foreground hover:text-accent hover:border-accent/50 transition-all disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={close}
              className="w-10 h-10 bg-card/80 backdrop-blur-sm border border-accent/20 rounded-full flex items-center justify-center text-foreground hover:text-accent hover:border-accent/50 transition-all ml-2"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Image container */}
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleDoubleAction}
            style={{ cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-[90vw] max-h-[85vh] object-contain select-none pointer-events-none transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              }}
              draggable={false}
            />
          </div>

          {/* Bottom hint */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground text-[10px] sm:text-xs tracking-wider uppercase">
            Double-tap to zoom · Scroll to adjust · Drag to pan
          </p>
        </div>
      )}
    </>
  );
};

export default ImageLightbox;
