"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { BASE_PATH } from "@/lib/base-path";

type ModelViewerElementConfig = {
  meshoptDecoderLocation?: string;
};

declare global {
  interface Window {
    ModelViewerElement?: ModelViewerElementConfig;
  }
}

export default function ArmModelViewer() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    window.ModelViewerElement = window.ModelViewerElement || {};
    window.ModelViewerElement.meshoptDecoderLocation = `${BASE_PATH}/vendor/meshopt-decoder.js`;

    import("@google/model-viewer").then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="well-inset mt-6 p-6">
      <div className="h-[420px] w-full overflow-hidden rounded-lg border border-black/10 sm:h-[520px]">
        {ready ? (
          <model-viewer
            src={`${BASE_PATH}/models/baker-bot-arm.glb`}
            alt="Interactive 3D model of Baker Bot's right arm assembly, showing the shoulder, elbow, forearm, and hand"
            camera-controls
            touch-action="pan-y"
            auto-rotate
            auto-rotate-delay="0"
            rotation-per-second="18deg"
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            tone-mapping="neutral"
            loading="lazy"
            reveal="auto"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f6f6f5",
              "--poster-color": "#f6f6f5",
              "--progress-bar-color": "#000000",
              "--progress-bar-height": "2px",
            } as CSSProperties}
          >
            <div slot="progress-bar" />
            <span
              slot="poster"
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground/30">
                Visual placeholder
              </span>
              <span className="text-xs uppercase tracking-widest text-foreground/45">
                Loading 3D model…
              </span>
            </span>
          </model-viewer>
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
            style={{ backgroundColor: "#f6f6f5" }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/30">
              Visual placeholder
            </span>
            <span className="text-xs uppercase tracking-widest text-foreground/45">
              Loading 3D model…
            </span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-foreground/50">
        The full right arm assembly in 3D. Drag to rotate, scroll to zoom.
      </p>
    </div>
  );
}
