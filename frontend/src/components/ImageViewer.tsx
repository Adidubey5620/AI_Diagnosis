import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Group } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { ZoomIn, ZoomOut, Move, RotateCcw, Layout, Ruler, Sun, Contrast, Eye, EyeOff } from 'lucide-react';

interface Annotation {
    label: string;
    coordinates: number[]; // [ymin, xmin, ymax, xmax] normalized 0-1000 or specific format? 
    // Gemini returns [ymin, xmin, ymax, xmax] 0-1000 usually.
    // Let's assume normalized 0-1000 for standard Gemini Vision.
    confidence: number;
    explanation?: string;
}

interface ImageViewerProps {
    imageUrl: string;
    annotations: Annotation[];
    onAnnotationClick?: (annotation: Annotation) => void;
    comparisonImageUrl?: string; // For side-by-side
}

// Custom filter for brightness/contrast
// Konva.Filters.Brighten and Contrast exist.

const URLImage = ({ src, brightness, contrast, width, height, x, y, scaleX, scaleY }: any) => {
    const [image] = useImage(src, 'anonymous'); // 'anonymous' for CORS if needed
    const imageRef = useRef<Konva.Image>(null);

    useEffect(() => {
        if (image && imageRef.current) {
            imageRef.current.cache();
            imageRef.current.getLayer()?.batchDraw();
        }
    }, [image, brightness, contrast]);

    return (
        <KonvaImage
            ref={imageRef}
            image={image}
            x={x}
            y={y}
            width={width}
            height={height}
            scaleX={scaleX}
            scaleY={scaleY}
            filters={[Konva.Filters.Brighten, Konva.Filters.Contrast]}
            brightness={brightness}
            contrast={contrast}
        />
    );
};

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, annotations, onAnnotationClick, comparisonImageUrl }) => {
    // View State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [brightness, setBrightness] = useState(0); // -1 to 1 (Konva range usually approx)
    const [contrast, setContrast] = useState(0); // -100 to 100
    const [showAnnotations, setShowAnnotations] = useState(true);
    const [isSplitView, setIsSplitView] = useState(false);

    // Tools
    const [activeTool, setActiveTool] = useState<'move' | 'ruler' | 'none'>('move');

    // Canvas dimensions
    const stageWidth = 800;
    const stageHeight = 600;

    // Reset View
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setBrightness(0);
        setContrast(0);
    };

    const handleZoom = (direction: 1 | -1) => {
        setScale(prev => Math.max(0.1, Math.min(5, prev + direction * 0.25)));
    };

    // Convert normalized coordinates [ymin, xmin, ymax, xmax] (0-1000) to pixel [x, y, w, h]
    const getRectProps = (coords: number[], imgWidth: number, imgHeight: number) => {
        const [ymin, xmin, ymax, xmax] = coords;
        return {
            x: (xmin / 1000) * imgWidth,
            y: (ymin / 1000) * imgHeight,
            width: ((xmax - xmin) / 1000) * imgWidth,
            height: ((ymax - ymin) / 1000) * imgHeight,
        };
    };

    // Split View Handling
    const displayedImages = isSplitView && comparisonImageUrl ? [imageUrl, comparisonImageUrl] : [imageUrl];
    const viewWidth = isSplitView ? stageWidth / 2 : stageWidth;

    return (
        <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-xl shadow-2xl text-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 bg-gray-800 p-3 rounded-lg border border-gray-700">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-gray-900 rounded p-1">
                    <button onClick={() => handleZoom(-1)} className="p-2 hover:bg-gray-700 rounded"><ZoomOut size={18} /></button>
                    <span className="w-12 text-center text-xs font-mono">{Math.round(scale * 100)}%</span>
                    <button onClick={() => handleZoom(1)} className="p-2 hover:bg-gray-700 rounded"><ZoomIn size={18} /></button>
                </div>

                {/* Pan/Move Tool */}
                <button
                    onClick={() => setActiveTool('move')}
                    className={`p-2 rounded ${activeTool === 'move' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    title="Pan Tool"
                >
                    <Move size={18} />
                </button>

                {/* Ruler Tool (Placeholder visual) */}
                <button
                    onClick={() => setActiveTool(activeTool === 'ruler' ? 'none' : 'ruler')}
                    className={`p-2 rounded ${activeTool === 'ruler' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    title="Ruler"
                >
                    <Ruler size={18} />
                </button>

                <div className="w-px h-8 bg-gray-700 mx-2" />

                {/* Brightness/Contrast */}
                <div className="flex items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <Sun size={16} className="text-yellow-400" />
                        <input
                            type="range" min="-0.5" max="0.5" step="0.05"
                            value={brightness} onChange={(e) => setBrightness(parseFloat(e.target.value))}
                            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Contrast size={16} className="text-gray-400" />
                        <input
                            type="range" min="-50" max="50" step="5"
                            value={contrast} onChange={(e) => setContrast(parseFloat(e.target.value))}
                            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="w-px h-8 bg-gray-700 mx-2" />

                {/* Toggles */}
                <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`p-2 rounded flex gap-2 items-center ${showAnnotations ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                >
                    {showAnnotations ? <Eye size={18} /> : <EyeOff size={18} />}
                    <span className="text-xs hidden sm:inline">Annotations</span>
                </button>

                {comparisonImageUrl && (
                    <button
                        onClick={() => setIsSplitView(!isSplitView)}
                        className={`p-2 rounded flex gap-2 items-center ${isSplitView ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                    >
                        <Layout size={18} />
                        <span className="text-xs hidden sm:inline">Compare</span>
                    </button>
                )}

                <button onClick={handleReset} className="ml-auto p-2 hover:bg-gray-700 rounded text-red-400" title="Reset View">
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Canvas Area */}
            <div className="relative border border-gray-700 bg-black rounded-lg overflow-hidden flex justify-center">
                {/*  We render multiple stages if split view, or one stage.
                      For simplicity with synced zoom/pan, let's render one stage but split layers/groups or just use flexbox divs with separate stages?
                      React-Konva Stage is a canvas. 
                      If we want side-by-side div split might be easier than canvas split logic.
                 */}
                <div className="flex w-full justify-center">
                    {displayedImages.map((src, idx) => (
                        <div key={idx} className={`relative ${isSplitView ? 'w-1/2 border-r border-gray-700' : 'w-full'} flex justify-center`}>
                            <Stage
                                width={viewWidth}
                                height={stageHeight}
                                draggable={activeTool === 'move'}
                                onWheel={(e) => {
                                    e.evt.preventDefault();
                                    handleZoom(e.evt.deltaY < 0 ? 1 : -1);
                                }}
                                scaleX={scale}
                                scaleY={scale}
                                x={position.x}
                                y={position.y}
                                onDragEnd={(e) => {
                                    setPosition({ x: e.target.x(), y: e.target.y() });
                                }}
                            >
                                <Layer>
                                    <URLImage
                                        src={src}
                                        x={0} y={0}
                                        // Fit to stage initially? Or hard px size?
                                        // Assuming image loads, we might want to center it.
                                        // For now, simpler: user pans/zooms.
                                        width={800} // Placeholder, ideally specific to image load
                                        height={600}
                                        brightness={brightness}
                                        contrast={contrast}
                                    />

                                    {/* Annotations (only on first image mainly, unless we have them for both) */}
                                    {idx === 0 && showAnnotations && annotations.map((ann, i) => {
                                        const rect = getRectProps(ann.coordinates, 800, 600); // Using assumed image size
                                        return (
                                            <Group
                                                key={i}
                                                onMouseEnter={(e) => {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'pointer';
                                                }}
                                                onMouseLeave={(e) => {
                                                    const container = e.target.getStage()?.container();
                                                    if (container) container.style.cursor = 'default';
                                                }}
                                                onClick={() => onAnnotationClick && onAnnotationClick(ann)}
                                            >
                                                <Rect
                                                    x={rect.x}
                                                    y={rect.y}
                                                    width={rect.width}
                                                    height={rect.height}
                                                    stroke="red"
                                                    strokeWidth={2 / scale} // Keep stroke consistent visually
                                                />
                                                <Rect
                                                    x={rect.x}
                                                    y={rect.y - 20 / scale}
                                                    width={ann.label.length * 8 + 30} // rough width
                                                    height={20 / scale}
                                                    fill="red"
                                                    opacity={0.8}
                                                />
                                                <Text
                                                    x={rect.x + 5 / scale}
                                                    y={rect.y - 15 / scale}
                                                    text={`${ann.label} (${Math.round(ann.confidence * 100)}%)`}
                                                    fill="white"
                                                    fontSize={12 / scale}
                                                />
                                            </Group>
                                        );
                                    })}

                                    {/* Ruler Tool Drawing */}
                                    {idx === 0 && activeTool === 'ruler' && (
                                        // Ruler implementation would go here (onMouseDown, onMouseMove)
                                        // For now just a hint text
                                        <Text x={10} y={10} text="Ruler Mode Active (Click & Drag)" fill="yellow" />
                                    )}
                                </Layer>
                            </Stage>
                            {isSplitView && idx === 0 && (
                                <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">Patient Scan</div>
                            )}
                            {isSplitView && idx === 1 && (
                                <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">Reference Normal</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-xs text-gray-500 flex justify-between">
                <span>Mouse Wheel to Zoom • Drag to Pan</span>
                <span>{imageUrl}</span>
            </div>
        </div>
    );
};

export default ImageViewer;
