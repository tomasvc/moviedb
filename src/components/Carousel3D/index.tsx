"use client";

import {
  useRef,
  ReactNode,
  Children,
  useEffect,
  useCallback,
  useState,
} from "react";
import { gsap } from "gsap";

type Props = {
  children: ReactNode;
};

const getResponsiveConfig = (width: number) => {
  if (width < 640) {
    return {
      slideWidth: 200,
      slideHeight: 280,
      spacing: 160,
      curveDepth: 150,
      curveAngle: 35,
      perspective: 800,
      containerHeight: 350,
      dragSensitivity: 1.2,
    };
  } else if (width < 1024) {
    return {
      slideWidth: 250,
      slideHeight: 340,
      spacing: 220,
      curveDepth: 220,
      curveAngle: 40,
      perspective: 900,
      containerHeight: 420,
      dragSensitivity: 1.0,
    };
  } else {
    return {
      slideWidth: 300,
      slideHeight: 400,
      spacing: 300,
      curveDepth: 300,
      curveAngle: 45,
      perspective: 1000,
      containerHeight: 500,
      dragSensitivity: 0.8,
    };
  }
};

export const Carousel3D: React.FC<Props> = ({ children }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const smoothVelocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lerpRef = useRef<number | null>(null);

  const childArray = Children.toArray(children);
  const itemCount = childArray.length;
  const centerIndex = Math.floor(itemCount / 2);

  const [config, setConfig] = useState(() =>
    getResponsiveConfig(
      typeof window !== "undefined" ? window.innerWidth : 1024
    )
  );

  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig(window.innerWidth));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const minOffset = -centerIndex;
  const maxOffset = itemCount - 1 - centerIndex;

  const clampOffset = useCallback(
    (value: number) => Math.max(minOffset, Math.min(maxOffset, value)),
    [minOffset, maxOffset]
  );

  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;

    const items =
      containerRef.current.querySelectorAll<HTMLElement>(".carousel-item");

    items.forEach((item, i) => {
      const relativePos = i - centerIndex - offsetRef.current;
      const x = relativePos * config.spacing;
      const z = -Math.pow(relativePos, 2) * (config.curveDepth / 4);
      const rotateY = -relativePos * config.curveAngle * 0.3;
      const scale = Math.max(0.75, 1 - Math.abs(relativePos) * 0.06);

      item.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
      item.style.zIndex = String(100 - Math.abs(Math.round(relativePos)));

      item.style.width = `${config.slideWidth}px`;
      item.style.height = `${config.slideHeight}px`;
      item.style.left = `${-config.slideWidth / 2}px`;
      item.style.top = `${-config.slideHeight / 2}px`;
    });
  }, [centerIndex, config]);

  const animate = useCallback(() => {
    updatePositions();
    lerpRef.current = requestAnimationFrame(animate);
  }, [updatePositions, clampOffset]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    gsap.killTweensOf(offsetRef);

    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    smoothVelocityRef.current = 0;

    rootRef.current?.setPointerCapture(e.pointerId);
    if (rootRef.current) {
      rootRef.current.style.cursor = "grabbing";
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const currentTime = performance.now();
      const deltaTime = Math.max(currentTime - lastTimeRef.current, 1);
      const deltaX = e.clientX - lastXRef.current;

      const instantVelocity = (-deltaX / deltaTime) * 16;
      smoothVelocityRef.current =
        smoothVelocityRef.current * 0.7 + instantVelocity * 0.3;

      offsetRef.current -= deltaX / config.spacing;

      lastXRef.current = e.clientX;
      lastTimeRef.current = currentTime;
    },
    [config.spacing, config.dragSensitivity]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      rootRef.current?.releasePointerCapture(e.pointerId);
      if (rootRef.current) {
        rootRef.current.style.cursor = "grab";
      }

      const velocity = smoothVelocityRef.current;

      if (Math.abs(velocity) > 0.3) {
        const momentum = velocity * 0.08 * config.dragSensitivity;
        const targetWithMomentum = clampOffset(offsetRef.current + momentum);

        gsap.to(offsetRef, {
          current: targetWithMomentum,
          duration: 0.8 + Math.min(Math.abs(momentum) * 0.1, 0.6),
          ease: "power2.out",
        });
      }
    },
    [clampOffset, config.dragSensitivity]
  );

  useEffect(() => {
    updatePositions();
    lerpRef.current = requestAnimationFrame(animate);

    return () => {
      if (lerpRef.current) {
        cancelAnimationFrame(lerpRef.current);
      }
    };
  }, [updatePositions, animate]);

  return (
    <div
      ref={rootRef}
      className="relative w-full flex items-center justify-center overflow-hidden select-none touch-none"
      style={{
        perspective: `${config.perspective}px`,
        cursor: "grab",
        height: `${config.containerHeight}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={containerRef}
        className="relative pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {childArray.map((child, i) => (
          <div
            key={i}
            className="carousel-item absolute"
            style={{
              transformStyle: "preserve-3d",
              width: config.slideWidth,
              height: config.slideHeight,
              left: -config.slideWidth / 2,
              top: -config.slideHeight / 2,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
