"use client";

import {
    Circle,
    Environment,
    OrbitControls,
    useProgress,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
    Suspense,
    useEffect,
    useState,
    Component,
    ReactNode,
    memo,
    useMemo,
} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { DRACOLoader } from "three-stdlib";

/* ------------------ Loading Spinner ------------------ */
function Loading() {
    const { progress } = useProgress();
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                {/* <p className="mt-4 text-gray-700 font-medium">
                    Loading model... {Math.round(progress)}%
                </p> */}
            </div>
        </div>
    );
}

/* ------------------ Error Boundary ------------------ */
class ModelErrorBoundary extends Component<
    { children: ReactNode; onRetry?: () => void },
    { hasError: boolean; error?: Error }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("❌ ModelViewer Error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="absolute inset-0 flex items-center justify-center bg-white flex-col gap-4">
                    <p className="text-red-500 font-semibold text-lg">
                        ❌ Failed to load 3D model
                    </p>
                    <p className="text-gray-600 text-sm">
                        {this.state.error?.message || "Model may be too large or corrupted."}
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined });
                            this.props.onRetry?.();
                        }}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

/* ------------------ Safe Model Loader ------------------ */
function SafeModel({ modelPath }: { modelPath: string }) {
    const [scene, setScene] = useState<THREE.Group | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loader = new GLTFLoader();

        // Attach DRACOLoader (safe even if the model isn't compressed)
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            modelPath,
            (gltf) => {
                if (!isMounted) return;
                setScene(gltf.scene);
            },
            undefined,
            (err) => {
                console.error("❌ GLTFLoader failed:", err);
                if (isMounted) setError("Model failed to load: " + (err as any).message);
            }
        );

        return () => {
            isMounted = false;
            if (scene) {
                scene.traverse((child: any) => {
                    if (child.isMesh) {
                        child.geometry?.dispose();
                        if (Array.isArray(child.material)) {
                            child.material.forEach((m: THREE.Material) => m.dispose());
                        } else {
                            child.material?.dispose();
                        }
                    }
                });
            }
        };
    }, [modelPath]);


    if (error) {
        return (
            <mesh>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshBasicMaterial color="red" />
            </mesh>
        );
    }

    if (!scene) return null;
    return <primitive object={scene} position={[0, 0.7, 0]} />;
}

/* ------------------ Optimized Canvas ------------------ */
function OptimizedCanvas({
    modelPath,
    backgroundColor = "transparent",
    environment = "apartment",
    enableZoom = true,
    enableRotate = true,
    showFloor = true,
    zoomMode = "normal",
}: {
    modelPath: string;
    backgroundColor?: string;
    environment?: string;
    enableZoom?: boolean;
    enableRotate?: boolean;
    showFloor?: boolean;
    zoomMode?: "moreless" | "less" | "normal" | "large";
}) {
    const zoomPresets = {
        moreless: {
            min: 5,
            max: 10,
            cam: [0.3, 0.5, 15] as [number, number, number],
            target: [0, 1, 0] as [number, number, number],
        },
        less: {
            min: 0.8,
            max: 3,
            cam: [0.5, 0.5, 3.5] as [number, number, number],
            target: [0, 1, 0] as [number, number, number],
        },
        normal: {
            min: 0.1,
            max: 1.8,
            cam: [0.5, 0.5, 1] as [number, number, number],
            target: [0, 1, 0] as [number, number, number],
        },
        large: {
            min: 0.05,
            max: 0.5,
            cam: [20, 300, 0] as [number, number, number],
            target: [0, 0.8, 0] as [number, number, number],
        },
    };

    const { min, max, cam, target } = zoomPresets[zoomMode];

    const cameraConfig = useMemo(
        () => ({
            position: cam as [number, number, number],
            fov: 45,
            near: 0.005,
            far: 1000,
        }),
        []
    );

    return (
        <Canvas
            camera={cameraConfig}
            gl={{ powerPreference: "high-performance" }}
            dpr={[1, 2]}
        >
            <color attach="background" args={[backgroundColor]} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
            <ModelErrorBoundary>
                <SafeModel modelPath={modelPath} />
            </ModelErrorBoundary>
            {showFloor && (
                <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
                    <meshStandardMaterial color="transparent" />
                </Circle>
            )}
            <Environment preset={environment as any} />
            <OrbitControls
                target={target}
                enablePan={true}
                minPolarAngle={Math.PI / 3.5}
                maxPolarAngle={Math.PI / 0.8}
                enableZoom={enableZoom}
                enableRotate={enableRotate}
                minDistance={min}
                maxDistance={max}
            />
        </Canvas>
    );
}

/* ------------------ Main Viewer ------------------ */
function ModelViewerComponent({
    modelPath,
    isOpen,
    onClose,
    backgroundColor = "transparent",
    showFloor = false,
    className = "",
    environment = "apartment",
    enableZoom = true,
    enableRotate = true,
    zoomMode = "normal",
}: {
    modelPath: string;
    isOpen: boolean;
    onClose: () => void;
    backgroundColor?: string;
    showFloor?: boolean;
    className?: string;
    environment?: string;
    enableZoom?: boolean;
    enableRotate?: boolean;
    zoomMode: "moreless" | "less" | "normal" | "large";
}) {
    if (!isOpen) return null;
    return (
        <div
            className={`fixed inset-0 bg-black/90 flex items-center justify-center z-50 ${className}`}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl w-[95vw] h-[90vh] overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-md z-30 hover:bg-gray-100"
                >
                    ✕
                </button>
                <Suspense fallback={<Loading />}>
                    <OptimizedCanvas
                        modelPath={modelPath}
                        backgroundColor={backgroundColor}
                        environment={environment}
                        enableZoom={enableZoom}
                        enableRotate={enableRotate}
                        showFloor={showFloor}
                        zoomMode={zoomMode}
                    />
                </Suspense>
            </div>
        </div>
    );
}


export default memo(ModelViewerComponent);
