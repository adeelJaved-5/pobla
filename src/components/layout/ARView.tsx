"use client";

import React, { useEffect, useState, useRef } from "react";
import Loading from "@/components/layout/Loading";
import CustomButton from "../ui/Button";
import { useTranslations } from "next-intl";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);
const ACircle = (props: any) => React.createElement("a-circle", props);
const ARing = (props: any) => React.createElement("a-ring", props);
const ALight = (props: any) => React.createElement("a-light", props);

const Marker = React.forwardRef((_, ref: any) => (
  <AEntity ref={ref} position="0 -0.9 -2">
    <ARing
      radius-inner="0.3"
      radius-outer="0.4"
      color="#4F46E5"
      opacity="0.8"
      rotation="-90 0 0"
    />
    <ACircle radius="0.3" color="#10B981" opacity="0.5" rotation="-90 0 0" />
  </AEntity>
));
Marker.displayName = "Marker";

interface AvatarProps {
  position: { x: number; y: number; z: number };
  isPlaying: boolean;
  userRotationY?: number;
  userScale?: number;
}

const Avatar = React.forwardRef((props: AvatarProps, forwardedRef: any) => {
  const localRef = useRef<any>(null);
  const avatarRef = forwardedRef || localRef;
  const {
    position,
    isPlaying,
    userRotationY = 0,
    userScale = 1.2,
  } = props;

  useEffect(() => {
    if (avatarRef.current) {
      const entity = avatarRef.current;
      const mesh = entity.getObject3D("mesh");

      const setupMaterials = (m: any) => {
        m.traverse((obj: any) => {
          obj.frustumCulled = false;
          
          if (obj.isMesh && obj.material) {
            const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
            materials.forEach((mat: any) => {
              if (mat) {
                if (mat.isMeshBasicMaterial) {
                  const THREE = (window as any).THREE;
                  if (THREE) {
                    const newMat = new THREE.MeshStandardMaterial();
                    newMat.map = mat.map;
                    newMat.color = mat.color;
                    obj.material = newMat;
                  }
                }
                if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                  mat.envMapIntensity = 2.0;
                  mat.needsUpdate = true;
                }
              }
            });
          }
        });
      };

      if (mesh) {
        setupMaterials(mesh);
      } else {
        entity.addEventListener("model-loaded", (evt: any) => {
          setupMaterials(evt.detail.model);
        });
      }
    }
  }, [avatarRef]);

  return (
    <AEntity
      ref={avatarRef}
      position={`${position.x} ${position.y} ${position.z}`}
      rotation={`-10 ${userRotationY} 0`}
      scale={`${userScale} ${userScale} ${userScale}`}
    >
      <AEntity
        gltf-model="url(/models/avatar5.glb)"
        animation-mixer={
          isPlaying
            ? "clip: *; loop: repeat; timeScale: 1"
            : "clip: *; loop: repeat; timeScale: 0"
        }
      />
    </AEntity>
  );
});
Avatar.displayName = "Avatar";

const Page = ({
  setShowARView,
  handleClose,
  audioUrl,
  linkLoad,
  from,
}: any) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const t = useTranslations("gameText");

  const [avatarPos, setAvatarPos] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [showAudioPopup, setShowAudioPopup] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [userRotationY, setUserRotationY] = useState(0);
  const [userScale, setUserScale] = useState(1.2);

  const isPlayingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const markerRef = useRef<any>(null);
  const avatarRef = useRef<any>(null);
  const gestureState = useRef<any>({});
  const orientationHandlerRef = useRef<any>(null);
  const dracoInitializedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);

        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          // @ts-ignore
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          try {
            // @ts-ignore
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") startOrientationTracking();
          } catch {
            /* ignore */
          }
        } else {
          startOrientationTracking();
        }
      } catch {
        setPermissionGranted(false);
      }
    })();

    return () => {
      if (orientationHandlerRef.current)
        window.removeEventListener(
          "deviceorientation",
          orientationHandlerRef.current
        );
    };
  }, []);

  const startOrientationTracking = () => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0,
      });
    };
    orientationHandlerRef.current = handleDeviceOrientation;
    window.addEventListener("deviceorientation", handleDeviceOrientation);
  };

  const isIOS = () =>
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  const startAnimationAndAudio = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.preload = "auto";
        audioRef.current.onended = () => {
          stopAnimationAndAudio();
          setTimeout(() => handleBackFromAR(), 100);
        };
      }
      await audioRef.current.play();
      isPlayingRef.current = true;
      setIsPlayingState(true);
    } catch {
      setShowAudioPopup(true);
    }
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

  const placeAvatar = () => {
    if (markerRef.current) {
      const worldPos = new (window as any).THREE.Vector3();
      markerRef.current.object3D.getWorldPosition(worldPos);
      setAvatarPos({ x: worldPos.x, y: worldPos.y + 0.3, z: worldPos.z });
      startAnimationAndAudio();
    }
  };

  const getTouchDistance = (t0: any, t1: any) => {
    const dx = t0.clientX - t1.clientX;
    const dy = t0.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };

  const getTouchMidpoint = (t0: any, t1: any) => ({
    x: (t0.clientX + t1.clientX) / 2,
    y: (t0.clientY + t1.clientY) / 2,
  });

  const onTouchStart = (e: React.TouchEvent) => {
    if (!avatarPos) return;
    e.stopPropagation();
    const touches = e.touches;
    gestureState.current.start = true;
    if (touches.length === 1) {
      gestureState.current.mode = "rotate";
      gestureState.current.startX = touches[0].clientX;
      gestureState.current.startRotationY = userRotationY;
    } else if (touches.length === 2) {
      gestureState.current.mode = "pinch";
      gestureState.current.startDist = getTouchDistance(touches[0], touches[1]);
      gestureState.current.startScale = userScale;
      gestureState.current.startMid = getTouchMidpoint(touches[0], touches[1]);
      gestureState.current.startPos = { ...avatarPos };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!gestureState.current.start) return;
    e.preventDefault();
    const touches = e.touches;
    if (gestureState.current.mode === "rotate" && touches.length === 1) {
      const dx = touches[0].clientX - gestureState.current.startX;
      const deltaY = dx * 0.2;
      setUserRotationY(gestureState.current.startRotationY + deltaY);
    } else if (touches.length === 2) {
      const dist = getTouchDistance(touches[0], touches[1]);
      const scaleFactor = dist / gestureState.current.startDist;
      const newScale = Math.min(
        Math.max(gestureState.current.startScale * scaleFactor, 0.2),
        2
      );
      setUserScale(newScale);

      const mid = getTouchMidpoint(touches[0], touches[1]);
      const dy = mid.y - gestureState.current.startMid.y;
      const dx = mid.x - gestureState.current.startMid.x;
      const panFactor = 0.0025 * (1 / Math.max(newScale, 0.2));

      setAvatarPos((p) =>
        p
          ? {
              x: gestureState.current.startPos.x - dx * panFactor,
              y: gestureState.current.startPos.y - dy * panFactor,
              z: gestureState.current.startPos.z,
            }
          : p
      );
    }
  };

  const onTouchEnd = () => {
    gestureState.current.start = false;
    gestureState.current.mode = null;
  };

  useEffect(() => {
    if (!permissionGranted) return;
    if (!linkLoad) {
      setScriptsLoaded(true);
      return;
    }

    const scriptClass = "poi-page-script";

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if ((window as any)._loadedScripts?.[src]) return resolve();
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();

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
      });

    const setupDracoLoader = () => {
      if (
        !(window as any).AFRAME ||
        !(window as any).THREE ||
        dracoInitializedRef.current
      )
        return;
      const AFRAME = (window as any).AFRAME;
      const THREE = (window as any).THREE;
      try {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
        );
        dracoLoader.preload();
        if (AFRAME.components["gltf-model"]) {
          const originalUpdate =
            AFRAME.components["gltf-model"].Component.prototype.update;
          AFRAME.components["gltf-model"].Component.prototype.update =
            function (oldData: any) {
              if (!this.loader) this.loader = new THREE.GLTFLoader();
              if (!this.loader.dracoLoader)
                this.loader.setDRACOLoader(dracoLoader);
              if (originalUpdate) return originalUpdate.call(this, oldData);
            };
        }
        dracoInitializedRef.current = true;
      } catch {
        /* ignore */
      }
    };

    const loadAll = async () => {
      try {
        if (!(window as any).AFRAME) {
          await loadScript("https://aframe.io/releases/1.3.0/aframe.min.js");
        }
        await new Promise<void>((resolve) => {
          const check = (): void => {
            if ((window as any).AFRAME) {
              resolve();
            } else {
              setTimeout(check, 50);
            }
          };
          check();
        });

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
          "https://cdn.jsdelivr.net/npm/aframe-extras@7.6.0/dist/aframe-extras.min.js"
        );
        if (!(window as any).THREE) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          );
        }
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js"
        );
        setupDracoLoader();
        setScriptsLoaded(true);
      } catch {
        setScriptsLoaded(false);
      }
    };

    loadAll();
  }, [permissionGranted, linkLoad]);

  useEffect(() => {
    if (!scriptsLoaded || !(window as any).AFRAME || !(window as any).THREE) return;
    
    const scene = document.querySelector("a-scene");
    if (!scene) return;

    const setupEnvironment = () => {
      const sceneEl = scene as any;
      const THREE = (window as any).THREE;
      
      if (sceneEl.hasLoaded && sceneEl.renderer && sceneEl.object3D) {
        const renderer = sceneEl.renderer;
        const scene3D = sceneEl.object3D;
        
        renderer.toneMapping = THREE.LinearToneMapping;
        renderer.toneMappingExposure = 1.0;
        
        if (sceneEl.components && sceneEl.components.environment) {
          try {
            sceneEl.setAttribute("environment", 
              "preset: venice-sunset; " +
              "toneMapping: linear; " +
              "exposure: 0; " +
              "punctualLights: true; " +
              "ambientIntensity: 0; " +
              "ambientColor: #ffffff; " +
              "directIntensity: 2.5; " +
              "directColor: #ffffff"
            );
          } catch {
            try {
              sceneEl.setAttribute("environment", {
                preset: "venice-sunset",
                toneMapping: "linear",
                exposure: 0,
                punctualLights: true,
                ambientIntensity: 0,
                ambientColor: "#ffffff",
                directIntensity: 2.5,
                directColor: "#ffffff"
              });
            } catch {
              // Environment component update failed, using lights only
            }
          }
        }
        
        const updateMaterials = () => {
          scene3D.traverse((object: any) => {
            if (object.isMesh && object.material) {
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach((material: any) => {
                if (material && (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial)) {
                  if (scene3D.environment) {
                    material.envMap = scene3D.environment;
                    material.envMapIntensity = 1.0;
                  }
                  material.needsUpdate = true;
                }
              });
            }
          });
        };
        
        updateMaterials();
        setTimeout(updateMaterials, 500);
        setTimeout(updateMaterials, 1500);
        setTimeout(updateMaterials, 3000);
      } else {
        sceneEl.addEventListener("loaded", setupEnvironment, { once: true });
      }
    };

    const timer = setTimeout(setupEnvironment, 500);
    
    return () => clearTimeout(timer);
  }, [scriptsLoaded]);

  if (!permissionGranted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white w-full">
        <p>⚠️ {t("cameraPermission")}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t("try_again")}
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
        renderer="alpha: true; logarithmicDepthBuffer: true; precision: mediump; toneMapping: Linear;"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ACamera position="0 0 0" look-controls="touchEnabled: false">
          {!avatarPos && <Marker ref={markerRef} />}
        </ACamera>

        <ALight
          type="directional"
          intensity={2}
          color="#ffffff"
          position="10 10 10"
        />
        <ALight
          type="ambient"
          intensity={0.5}
          color="#ffffff"
        />

        {avatarPos && (
          <Avatar
            ref={avatarRef}
            position={avatarPos}
            isPlaying={isPlayingState}
            userRotationY={userRotationY}
            userScale={userScale}
          />
        )}

        <AEntity
          environment="preset: venice-sunset; toneMapping: linear; exposure: 0; punctualLights: true; ambientIntensity: 0; ambientColor: #ffffff; directIntensity: 2; directColor: #ffffff;"
        />
      </AScene>

      {avatarPos && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483648,
            touchAction: "none",
            background: "transparent",
          }}
        />
      )}

      {!avatarPos && (
        <div
          className={`fixed bottom-10 w-full flex justify-center mx-auto px-5 ${
            from === "intro" ? "left-0" : ""
          }`}
          style={{ zIndex: 2147483646 }}
        >
          <CustomButton
            onClick={placeAvatar}
            className="bg-green-600 w-[200px] text-white shadow-lg"
          >
            {t("place")}
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
              🔊 {t("audioPermission")}
            </p>
            <CustomButton
              onClick={handleAllowAudio}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {t("audioAllow")}
            </CustomButton>
            <CustomButton
              onClick={() => setShowAudioPopup(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              {t("Cancel")}
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
