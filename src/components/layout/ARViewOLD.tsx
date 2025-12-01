"use client";

import React, { useEffect, useState, useRef } from "react";
import Loading from "@/components/layout/Loading";
import CustomButton from "../ui/Button";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);
const ACircle = (props: any) => React.createElement("a-circle", props);
const ARing = (props: any) => React.createElement("a-ring", props);

// --- Marker ---
const Marker = React.forwardRef((_, ref: any) => (
  <AEntity ref={ref} position="0 -1.5 -2">
    <ARing
      radius-inner="0.3"
      radius-outer="0.4"
      color="#4F46E5"
      opacity="0.8"
      rotation="-90 0 0"
    />
    <ACircle
      radius="0.3"
      color="#10B981"
      opacity="0.5"
      rotation="-90 0 0"
    />
  </AEntity>
));

// --- Avatar ---
const Avatar = ({
  position,
  isPlaying,
}: {
  position: { x: number; y: number; z: number };
  isPlaying: boolean;
}) => (
  <AEntity
    position={`${position.x} ${position.y} ${position.z}`}
    scale="1 1 1"
  >
    <AEntity
      gltf-model="url(/models/01_mouth_eyes_movement.glb)"
      animation-mixer={
        isPlaying
          ? "clip: *; loop: repeat; timeScale: 1"
          : "clip: *; loop: repeat; timeScale: 0"
      }
    />
  </AEntity>
);

// --- Main Page ---
const Page = ({ setShowARView, handleClose, audioUrl, linkLoad }: any) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const [avatarPos, setAvatarPos] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [showAudioPopup, setShowAudioPopup] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);
  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const markerRef = useRef<any>(null);

  // Permissions
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);
      } catch {
        setPermissionGranted(false);
      }
    })();
  }, []);

  const isIOS = () => {
    return (
      typeof navigator !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream
    );
  };

  const startAnimationAndAudio = () => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        isPlayingRef.current = true;
        setIsPlayingState(true);
      })
      .catch(() => setShowAudioPopup(true));
  };

  const stopAnimationAndAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    isPlayingRef.current = false;
    setIsPlayingState(false);
  };

  const handleBackFromAR = () => {
    stopAnimationAndAudio();
    setShowARView(false);
    handleClose();
  };

  const handleAllowAudio = () => {
    setShowAudioPopup(false);
    startAnimationAndAudio();
  };

  // --- Unlock audio on first user gesture ---
  useEffect(() => {
    const unlockAudio = async () => {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.preload = "auto";
        audioRef.current.onended = () => {
          stopAnimationAndAudio();
          setAudioCompleted(true);
          setTimeout(() => handleBackFromAR(), 2000);
        };

        try {
          // try to unlock on first tap/click
          await audioRef.current.play();
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } catch (e) {
          console.warn("Audio unlock failed:", e);
        }
      }
    };

    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("click", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };
  }, [audioUrl]);

  // Load scripts
  useEffect(() => {
    if (!permissionGranted) return;
    if (!linkLoad) {
      setScriptsLoaded(true);
      return;
    }

    const scriptClass = "poi-page-script";
    const addedScripts: HTMLScriptElement[] = [];
    document
      .querySelectorAll(`script[data-page-script="ar-page-script"]`)
      .forEach((s) => s.remove());

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if ((window as any)._loadedScripts?.[src]) return resolve();
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.classList.add(scriptClass);
        s.dataset.pageScript = scriptClass;
        s.onload = () => {
          (window as any)._loadedScripts = {
            ...(window as any)._loadedScripts,
            [src]: true,
          };
          resolve();
        };
        s.onerror = () => reject();
        document.head.appendChild(s);
        addedScripts.push(s);
      });

    const loadAll = async () => {
      try {
        await loadScript("https://aframe.io/releases/1.3.0/aframe.min.js");
        if (isIOS()) {
          await loadScript(
            "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js"
          );
        } else {
          await loadScript(
            "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar-nft.min.js"
          );
        }
        await loadScript(
          "https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.min.js"
        );
        setScriptsLoaded(true);
      } catch (e) {
        console.error("POIIntro page load failed", e);
        setScriptsLoaded(false);
      }
    };

    loadAll();
    return () => addedScripts.forEach((s) => s.remove());
  }, [permissionGranted, linkLoad]);

  // --- Place avatar at marker position ---
  const placeAvatar = () => {
    if (markerRef.current) {
      const pos = markerRef.current.getAttribute("position");
      if (pos && typeof pos === "object") {
        setAvatarPos({ x: pos.x, y: pos.y, z: pos.z });
      } else if (typeof pos === "string") {
        const [x, y, z] = pos.split(" ").map(Number);
        setAvatarPos({ x, y, z });
      }
      startAnimationAndAudio();
    }
  };

  if (!permissionGranted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <p>⚠️ Camera permission required</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!scriptsLoaded || !(window as any).AFRAME) return <Loading />;

  return (
    <div className="w-full h-screen relative">
      <AScene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; videoTexture: true; facingMode: environment; debugUIEnabled: false"
        renderer="alpha: true; logarithmicDepthBuffer: true; precision: mediump;"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Marker only shows until avatar is placed */}
        {!avatarPos && <Marker ref={markerRef} />}

        {/* Avatar appears after button click */}
        {avatarPos && (
          <Avatar position={avatarPos} isPlaying={isPlayingState} />
        )}

        <ACamera position="0 0 0" />
      </AScene>

      {/* Place button until avatar is placed */}
      {!avatarPos && (
        <div className="absolute bottom-18 w-full flex justify-center">
          <CustomButton
            onClick={placeAvatar}
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg"
          >
            Place Avatar
          </CustomButton>
        </div>
      )}

      {showAudioPopup && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
          style={{ zIndex: 2147483647 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <p className="text-lg font-semibold text-center">
              🔊 Audio permission required
            </p>
            <CustomButton
              onClick={handleAllowAudio}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Allow Audio
            </CustomButton>
            <CustomButton
              onClick={() => setShowAudioPopup(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
