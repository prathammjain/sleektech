"use client";

import { useEffect, useRef, useState } from "react";

const PLAYLIST_ID = "6fRYnkKe7qdeOcin5yt8dq";
const OPEN_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

type SpotifyController = {
  togglePlay: () => void;
  addListener: (
    event: string,
    cb: (e: { data?: { isPaused?: boolean } }) => void,
  ) => void;
};
type SpotifyIframeApi = {
  createController: (
    el: HTMLElement,
    opts: { uri: string; width: string | number; height: string | number },
    cb: (controller: SpotifyController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

/**
 * A brand-styled Spotify player. The visible Spotify embed handles playback
 * (30s previews when the visitor isn't logged into Spotify — an embed limit),
 * while a custom face adds a spinning disc + equalizer that react to play state
 * via Spotify's iframe API. "Open on Spotify" deep-links to full tracks.
 */
export default function StudioPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let started = false;
    let fallback: ReturnType<typeof setTimeout> | undefined;

    // Only load Spotify once the player is near the viewport — keeps it off the
    // initial page load entirely (the player sits at the bottom of the page).
    const start = () => {
      if (started) return;
      started = true;

      window.onSpotifyIframeApiReady = (api) => {
        if (cancelled || !embedRef.current) return;
        api.createController(
          embedRef.current,
          { uri: `spotify:playlist:${PLAYLIST_ID}`, width: "100%", height: 152 },
          (ctrl) => {
            if (cancelled) return;
            controller.current = ctrl;
            setReady(true);
            ctrl.addListener("playback_update", (e) => {
              if (e?.data && typeof e.data.isPaused === "boolean") {
                setPlaying(!e.data.isPaused);
              }
            });
          },
        );
      };

      if (!document.getElementById("spotify-iframe-api")) {
        const s = document.createElement("script");
        s.id = "spotify-iframe-api";
        s.src = "https://open.spotify.com/embed/iframe-api/v1";
        s.async = true;
        document.body.appendChild(s);
      }

      // Fallback: if the API hasn't built a player within a few seconds
      // (blocked / slow), drop in a plain embed so audio still works.
      fallback = setTimeout(() => {
        const host = embedRef.current;
        if (cancelled || !host || host.querySelector("iframe")) return;
        const f = document.createElement("iframe");
        f.src = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;
        f.width = "100%";
        f.height = "152";
        f.loading = "lazy";
        f.style.border = "0";
        f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        host.appendChild(f);
      }, 3500);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      if (fallback) clearTimeout(fallback);
    };
  }, []);

  const toggle = () => controller.current?.togglePlay();

  return (
    <div className="studio-player" ref={containerRef}>
      <div className="sp-face">
        <button
          type="button"
          className={`sp-disc${playing ? " spinning" : ""}`}
          onClick={toggle}
          disabled={!ready}
          aria-label={playing ? "Pause" : "Play"}
        >
          <span className="sp-disc-icon">{playing ? "❚❚" : "▶"}</span>
        </button>

        <div className="sp-info">
          <span className="sp-kicker">Studio rotation</span>
          <span className="sp-title">SleekTech Radio</span>
          <div className={`sp-eq${playing ? " on" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <a className="sp-open" href={OPEN_URL} target="_blank" rel="noreferrer">
          Open on Spotify ↗
        </a>
      </div>

      <div className="sp-embed" ref={embedRef} />
    </div>
  );
}
