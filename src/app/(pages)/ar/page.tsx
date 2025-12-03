"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import Loading from "@/components/layout/Loading";
import api from "@/lib/axios";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getPOICoinConfig, getPOITotalCoins } from "@/utils/location";

const AScene = (props: any) => React.createElement("a-scene", props);
const ACamera = (props: any) => React.createElement("a-camera", props);
const AEntity = (props: any) => React.createElement("a-entity", props);


const Page = () => {
  const { user, refreshUser } = useUser();
  const router = useRouter();
  const t = useTranslations("Progress");
  const t2 = useTranslations("gameText");

  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [points, setPoints] = useState(0);
  const [onLoadPoints, setOnLoadPoints] = useState(0);
  const [floatingRocks, setFloatingRocks] = useState<any[]>([]);
  const [collectedCoins, setCollectedCoins] = useState<number[]>([]);
  const [coinConfig, setCoinConfig] = useState<number[] | null>(null);
  const collectedCoinsRef = useRef<number[]>([]);
  const spawnedCoinIndexRef = useRef(0);

  const sceneRef = useRef<any>(null);
  const locale = useLocale();
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);
  const explosionAudioRef = useRef<HTMLAudioElement>(null);
  const eventListenersRef = useRef<
    Map<string, { click: (e: Event) => void; touchstart: (e: Event) => void }>
  >(new Map());
  const floatingRocksRef = useRef<any[]>([]);
  const rafRef = useRef<number | null>(null);
  const hasAutoPlayed = useRef(false);
  const hasInitialized = useRef(false);
  const navigationInProgress = useRef(false);
  const dracoInitializedRef = useRef(false);
  
  const rocksInitializedRef = useRef(false);

  const MAX_VISIBLE_ROCKS = 10;

  // Initialize coin configuration based on current POI
  useEffect(() => {
    if (!user) return;
    const currentPOI = user.POIsCompleted ?? 0;
    const config = getPOICoinConfig(currentPOI);
    setCoinConfig(config);
    setCollectedCoins([]);
    collectedCoinsRef.current = [];
    spawnedCoinIndexRef.current = 0;
    
    // If this POI doesn't have coins (quiz POI), redirect
    if (config === null) {
      router.push(`/volcano/${currentPOI + 1}`);
    }
  }, [user, router]);

  useEffect(() => {
    if (hasInitialized.current) return;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);
      } catch {
        setPermissionGranted(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;

    const timer = setTimeout(() => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = 0.08;
        backgroundAudioRef.current.play().catch(() => { });
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!onLoadPoints && user?.points) setOnLoadPoints(user.points);
  }, [user?.points]);

  // Optimized script loading - only run once
  useEffect(() => {
    if (!permissionGranted || scriptsLoaded || hasInitialized.current) return;

    const scriptClass = "ar-page-script";

    // Check if scripts are already loaded
    if ((window as any).AFRAME && (window as any).ARjs) {
      setScriptsLoaded(true);
      hasInitialized.current = true;
      return;
    }

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
          await loadScript(
            "https://raw.githack.com/AR-js-org/AR.js/3.4.5/aframe/build/aframe-ar.js"
          );
        }

        if (!(window as any).AFRAME.components['particle-system']) {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/aframe-particle-system-component@1.1.3/dist/aframe-particle-system-component.min.js"
          );
        }

        // Wait for THREE to be available (A-Frame includes THREE)
        await new Promise<void>((resolve) => {
          const check = (): void => {
            if ((window as any).THREE) {
              resolve();
            } else {
              setTimeout(check, 50);
            }
          };
          check();
        });

        // Load DRACOLoader if not already available
        if (!(window as any).THREE?.DRACOLoader) {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js"
          );
        }

        setupDracoLoader();
        
        // Register component to brighten GLB materials
        if ((window as any).AFRAME && !(window as any).AFRAME.components['brighten-material']) {
          (window as any).AFRAME.registerComponent('brighten-material', {
            init: function() {
              this.el.addEventListener('model-loaded', () => {
                const model = this.el.getObject3D('mesh');
                if (model) {
                  model.traverse((node: any) => {
                    if (node.isMesh && node.material) {
                      if (Array.isArray(node.material)) {
                        node.material.forEach((mat: any) => {
                          if (mat) {
                            mat.emissive = new (window as any).THREE.Color(0xffffff);
                            mat.emissiveIntensity = 0.1;
                            mat.needsUpdate = true;
                          }
                        });
                      } else {
                        node.material.emissive = new (window as any).THREE.Color(0xffffff);
                        node.material.emissiveIntensity = 0.1;
                        node.material.needsUpdate = true;
                      }
                    }
                  });
                }
              });
            }
          });
        }
        
        setScriptsLoaded(true);
        hasInitialized.current = true;
      } catch (e) {
        console.error("AR page load failed", e);
        setScriptsLoaded(false);
      }
    };

    loadAll();
    
    return () => {
    };
  }, [permissionGranted]);

  useEffect(() => {
    floatingRocksRef.current = floatingRocks;
  }, [floatingRocks]);

  useEffect(() => {
    collectedCoinsRef.current = collectedCoins;
  }, [collectedCoins]);

  useEffect(() => {
    if (!scriptsLoaded || rocksInitializedRef.current || floatingRocks.length > 0 || !coinConfig) return;

    spawnInitialRocks();
    rocksInitializedRef.current = true;
  }, [scriptsLoaded, coinConfig]);

  useEffect(() => {
    if (!scriptsLoaded || !sceneRef.current || floatingRocks.length === 0) return;

    const sceneEl: any = sceneRef.current;

    if (rafRef.current) return;

    const loop = (time: number) => {
      const t = time * 0.001;
      floatingRocksRef.current.forEach((rock) => {
        if (!rock || rock.visible === false || rock.disappearing) return;
        const el = sceneEl.querySelector(`#${rock.id}`);
        if (!el || !el.object3D) return;

        const radius =
          rock.orbitRadius ??
          Math.sqrt(rock.position.x ** 2 + rock.position.z ** 2);
        const angle = (rock.baseAngle ?? 0) + t * (rock.angularSpeed ?? 0.6);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y =
          rock.initialY +
          Math.sin(t * (1 + (rock.angularSpeed ?? 0.6)) + (rock.phase ?? 0)) *
          rock.floatingRange;

        el.object3D.position.set(x, y, z);
        el.object3D.rotation.y += 0.005 + (rock.angularSpeed ?? 0.3) * 0.001;
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    const startAnimation = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(loop);
    };

    if (sceneEl.hasLoaded || sceneEl.isPlaying) {
      startAnimation();
    } else {
      sceneEl.addEventListener("loaded", startAnimation, { once: true });
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [scriptsLoaded]); 

  useEffect(() => {
    if (!scriptsLoaded || !sceneRef.current) return;

    const scene = sceneRef.current;
    
    // Clean up old listeners
    eventListenersRef.current.forEach((listeners, rockId) => {
      const rockEl = scene.querySelector(`#${rockId}`);
      if (rockEl) {
        try {
          rockEl.removeEventListener("click", listeners.click);
          rockEl.removeEventListener("touchstart", listeners.touchstart);
        } catch (e) {
          // Element might be removed, ignore
        }
      }
    });
    eventListenersRef.current.clear();

    // Add new listeners with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      floatingRocks.forEach((rock) => {
        if (rock.visible && !rock.disappearing) {
          const rockEl = scene.querySelector(`#${rock.id}`);
          if (rockEl && !eventListenersRef.current.has(rock.id)) {
            const handleTap = (e: Event) => {
              e.stopPropagation();
              handleRockTap(rock.id);
            };
            const listeners = { click: handleTap, touchstart: handleTap };
            rockEl.addEventListener("click", handleTap, { passive: false });
            rockEl.addEventListener("touchstart", handleTap, { passive: false });
            eventListenersRef.current.set(rock.id, listeners);
          }
        }
      });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [scriptsLoaded, floatingRocks]); 

  useEffect(() => {
    if (user?.POIsCompleted >= 0 && !hasAutoPlayed.current) {
      const handleFirstInteraction = () => {
        backgroundAudioRef.current?.play().catch(() => { });
        if (explosionAudioRef.current) {
          explosionAudioRef.current.play().catch(() => { });
          explosionAudioRef.current.pause();
          explosionAudioRef.current.currentTime = 0;
        }
        hasAutoPlayed.current = true;
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("touchstart", handleFirstInteraction);
      };
      window.addEventListener("click", handleFirstInteraction, { once: true });
      window.addEventListener("touchstart", handleFirstInteraction, {
        once: true,
      });
    }
  }, [user, locale]);

  if (!user) return <Loading />;

  const POICompleted = user?.POIsCompleted ?? 0;

  const updatePoints = async (newPoints: any) => {
    try {
      await api.post("/user", { points: (onLoadPoints || 0) + newPoints });
      await refreshUser();
    } catch (err: any) {
      console.error("Failed to update:", err.response?.data || err.message);
    }
  };

  const spawnRock = (coinValue?: number, id?: string) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 8 + 3;
    const height = Math.random() * 3 + 1;
    const safeId =
      id ??
      `floating-rock-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

    return {
      id: safeId,
      position: { x: Math.cos(angle) * radius, y: height, z: Math.sin(angle) },
      scale: Math.random() * 0.05 + 0.3,
      rotation: {
        x: Math.random() * Math.PI,
        y: Math.random() * Math.PI,
        z: Math.random() * Math.PI,
      },
      floatingRange: Math.random() * 0.1 + 0.05,
      initialY: height,
      visible: true,
      disappearing: false,
      orbitRadius: radius,
      baseAngle: angle,
      angularSpeed: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
      spinDuration: Math.floor(Math.random() * 10000) + 15000,
      spinDelay: Math.random() * 2000,
      orbitDuration: Math.floor(Math.random() * 20000) + 25000,
      orbitDelay: Math.random() * 3000,
      orbitTarget: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 3 + 1,
        z: (Math.random() - 0.5) * 10,
      },
      coinValue: coinValue ?? 1,
    };
  };

  const spawnInitialRocks = () => {
    if (!coinConfig) return;
    
    // Create rocks based on coin configuration
    // Spawn initial batch of coins (up to MAX_VISIBLE_ROCKS or total coins, whichever is smaller)
    // This ensures we show exactly the number of coins from the config
    const rocks: any[] = [];
    const initialCount = Math.min(MAX_VISIBLE_ROCKS, coinConfig.length);
    
    for (let i = 0; i < initialCount; i++) {
      const coinValue = coinConfig[i];
      rocks.push(spawnRock(coinValue, `coin-${i}`));
    }
    
    setFloatingRocks(rocks);
    spawnedCoinIndexRef.current = initialCount;
  };

  const handleRockTap = (rockId: string) => {
    if (navigationInProgress.current || !coinConfig) return;
    
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;
    
    const rockEl = sceneEl.querySelector(`#${rockId}`);
    if (!rockEl) return;

    // Find the rock to get its coin value - use ref to get current state
    const rock = floatingRocksRef.current.find((r) => r.id === rockId);
    if (!rock || rock.disappearing) return;

    // Mark rock as disappearing immediately to prevent double-tap
    setFloatingRocks((prev) => 
      prev.map((r) => r.id === rockId ? { ...r, disappearing: true } : r)
    );

    const coinValue = rock.coinValue || 1;

    if (explosionAudioRef.current) {
      explosionAudioRef.current.currentTime = 0;
      explosionAudioRef.current.play().catch(() => { });
    }

    const rockPos = rockEl.getAttribute("position");

    createExplosionEffects(sceneEl, rockPos);

    // Remove event listeners immediately
    const listeners = eventListenersRef.current.get(rockId);
    if (listeners && rockEl) {
      try {
        rockEl.removeEventListener("click", listeners.click);
        rockEl.removeEventListener("touchstart", listeners.touchstart);
      } catch (e) {
        // Ignore errors
      }
      eventListenersRef.current.delete(rockId);
    }

    // Update collected coins
    const newCollectedCoins = [...collectedCoinsRef.current, coinValue];
    setCollectedCoins(newCollectedCoins);

    // Calculate totals
    const totalCollected = newCollectedCoins.reduce((sum, val) => sum + val, 0);
    const totalNeeded = coinConfig.reduce((sum, val) => sum + val, 0);

    // Remove rock and potentially spawn new one
    setFloatingRocks((prev) => {
      const updated = prev.filter((rock) => rock.id !== rockId);
      
      // If we haven't collected all coins and haven't spawned all coins, spawn a new one
      // Only spawn if we haven't reached the total number of coins in the config
      if (totalCollected < totalNeeded && spawnedCoinIndexRef.current < coinConfig.length && updated.length < MAX_VISIBLE_ROCKS) {
        const nextCoinValue = coinConfig[spawnedCoinIndexRef.current];
        updated.push(spawnRock(nextCoinValue, `coin-${spawnedCoinIndexRef.current}`));
        spawnedCoinIndexRef.current += 1;
      }
      
      return updated;
    });

    setPoints((prev) => {
      const newPoints = prev + coinValue;
      updatePoints(newPoints);
      
      // Check if all coins are collected (total collected value >= total needed)
      // Also check if we've collected the exact number of coins from the config
      if (totalCollected >= totalNeeded && newCollectedCoins.length >= coinConfig.length) {
        navigationInProgress.current = true;
        // Small delay to ensure state updates complete before navigation
        setTimeout(() => {
          router.push(`/volcano/${(user?.POIsCompleted ?? 0) + 1}`);
        }, 100);
      }
      return newPoints;
    });
  };

  const createExplosionEffects = (sceneEl: any, rockPos: any) => {
    for (let i = 0; i < 2; i++) {
      const particle = document.createElement("a-entity");
      const shapes = ["tetrahedron", "dodecahedron", "octahedron"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      particle.setAttribute(
        "geometry",
        `primitive: ${shape}; radius: 0.08; detail: ${Math.floor(Math.random() * 2)}`
      );
      particle.setAttribute(
        "material",
        `color: #000000; metalness: 0; roughness: 1; flatShading: true; opacity: 1; transparent: false`
      );
      particle.setAttribute(
        "position",
        `${rockPos.x + (Math.random() - 0.5) * 0.5} ${rockPos.y} ${rockPos.z + (Math.random() - 0.5) * 0.5}`
      );
      particle.object3D.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      particle.setAttribute(
        "animation",
        `property: position; to: ${rockPos.x + (Math.random() - 0.5) * 1} ${rockPos.y + Math.random() * 2} ${rockPos.z + (Math.random() - 0.5) * 1}; dur: 800; easing: easeOutCubic`
      );
      particle.setAttribute(
        "animation__fade",
        `property: material.opacity; from: 1; to: 0; dur: 800; easing: linear`
      );

      sceneEl.appendChild(particle);
      particle.addEventListener("animationcomplete__fade", () => {
        particle.isConnected && particle.remove();
      });
    }

    const flash = document.createElement("a-entity");
    flash.setAttribute("geometry", "primitive: sphere; radius: 0.5");
    flash.setAttribute(
      "material",
      "color: black; emissive: #000000; opacity: 0.1; transparent: true"
    );
    flash.setAttribute("position", rockPos);
    flash.setAttribute(
      "animation",
      "property: scale; from: 0.2 0.2 0.2; to: 2 2 2; dur: 200; easing: easeOutQuad;"
    );
    flash.setAttribute(
      "animation__fade",
      "property: material.opacity; from: 0.1; to: 0; dur: 200; delay: 100; easing: easeOutQuad;"
    );
    sceneEl.appendChild(flash);
    setTimeout(() => flash.isConnected && flash.remove(), 400);

    const debris = document.createElement("a-entity");
    debris.setAttribute(
      "particle-system",
      `particleCount: 150; color: #888, #555, #333; size: 0.2; sizeRandomness: 0.5; velocityValue: 0 2 0; velocitySpread: 2 2 2; opacity: 1; opacityRandomness: 0.3; duration: 1;`
    );
    debris.setAttribute("position", rockPos);
    sceneEl.appendChild(debris);
    setTimeout(() => debris.isConnected && debris.remove(), 1200);
  };

  if (!permissionGranted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white w-full">
        <p>⚠️ {t2("cameraPermission")}</p>
        <button
          onClick={async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
              stream.getTracks().forEach(track => track.stop());
              setPermissionGranted(true);
            } catch {
              setPermissionGranted(false);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t2("try_again")}
        </button>
      </div>
    );
  }

  if (!scriptsLoaded) return <Loading />;

  // If this POI doesn't have coins, don't show AR page
  if (coinConfig === null) {
    return <Loading />;
  }

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <style jsx>{`
        .floating-rock {
          animation: rockAppear 2s ease-out forwards;
        }
        .floating-rock.disappearing {
          animation: rockDisappear 1.5s ease-in forwards;
        }
        a-cursor, .a-canvas .a-cursor {
          display: none !important;
          visibility: hidden !important;
        }
        @keyframes particleRise {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(0.2); opacity: 0; }
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .eruption {
          position: fixed;
          pointer-events: none;
          z-index: 1002;
        }
      `}</style>

      <audio
        ref={backgroundAudioRef}
        src="/sounds/background-music.mp3"
        preload="auto"
        style={{ display: "none" }}
      />
      <audio
        ref={explosionAudioRef}
        src="/sounds/explosion.mp3"
        preload="auto"
        style={{ display: "none" }}
      />

      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "10px",
          fontSize: "18px",
          fontWeight: "bold",
          zIndex: 1000,
          border: "2px solid #ff6b35",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        }}
      >
        {t("title5")}: {user?.points}
      </div>

      <AScene
        key="ar-scene" 
        ref={sceneRef}
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
        renderer="antialias: true; alpha: true; logarithmicDepthBuffer: true"
        system="rendererConfiguration: { logarithmicDepthBuffer: true }"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ACamera
          id="camera"
          listener
          rotation-reader
          look-controls="reverseMouseDrag:true; touchEnabled: false;"
          cursor="fuse: false; rayOrigin: mouse;"
          raycaster="objects: .floating-rock; showLine: false"
        />

        {floatingRocks.map((rock) => (
          <AEntity
            key={rock.id} 
            id={rock.id}
            gltf-model="url(/models/coin_to_catch.glb)"
            brighten-material
            position={`${rock.position.x} ${rock.position.y} ${rock.position.z}`}
            scale={`${rock.scale} ${rock.scale} ${rock.scale}`}
            rotation={`${rock.rotation.x} ${rock.rotation.y} ${rock.rotation.z}`}
            visible={rock.visible && !rock.disappearing}
            className={`floating-rock ${rock.disappearing ? "disappearing" : ""}`}
            animation__spin={`
              property: rotation;
              to: ${Math.random() > 0.5 ? "0 360 0" : "360 0 0"};
              loop: true;
              dur: ${rock.spinDuration};
              easing: linear;
              delay: ${rock.spinDelay};
            `}
          />
        ))}
      </AScene>
    </div>
  );
};


export default Page;