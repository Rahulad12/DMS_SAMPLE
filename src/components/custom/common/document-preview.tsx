// document-preview.tsx
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect, type WheelEvent } from 'react';

interface DocumentPreviewProps {
    document: any;
    previewSource: string | null;
    isBase64: boolean;
}

export function DocumentPreview({ document, previewSource, isBase64 }: DocumentPreviewProps) {
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleResetZoom = () => {
        setScale(0.75);
        setPosition({ x: 0, y: 0 });
    };

    // const handleFitToScreen = () => {
    //     if (imageRef.current && containerRef.current) {
    //         const containerWidth = containerRef.current.clientWidth;
    //         const containerHeight = containerRef.current.clientHeight;
    //         const imageWidth = imageRef.current.naturalWidth;
    //         const imageHeight = imageRef.current.naturalHeight;

    //         const scaleX = containerWidth / imageWidth;
    //         const scaleY = containerHeight / imageHeight;
    //         const newScale = Math.min(scaleX, scaleY, 1);

    //         setScale(newScale);
    //         setPosition({ x: 0, y: 0 });
    //     }
    // };

    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Reset zoom when document changes
    useEffect(() => {
        setScale(0.5);
        setPosition({ x: 0, y: 0 });
    }, [document]);

    return (
        <div className="flex flex-col border h-full">
            <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-white">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-slate-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 text-slate-600"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    Document Preview
                </h3>

                <div className="flex items-center gap-2">
                    {(isBase64 || document.type === 'image') && previewSource && (
                        <div className="flex items-center gap-1 mr-2 bg-slate-100 rounded-lg p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleZoomOut}
                                disabled={scale <= 0.5}
                                className="h-8 w-8 p-0 hover:bg-slate-200"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </Button>

                            <div className="px-2 text-sm font-medium text-slate-700 min-w-[60px] text-center">
                                {Math.round(scale * 100)}%
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleZoomIn}
                                disabled={scale >= 3}
                                className="h-8 w-8 p-0 hover:bg-slate-200"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetZoom}
                                className="h-8 w-8 p-0 hover:bg-slate-200"
                                title="Reset Zoom"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>

                            {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleFitToScreen}
                                className="h-8 w-8 p-0 hover:bg-slate-200"
                                title="Fit to Screen"
                            >
                                <Maximize2 className="w-4 h-4" />
                            </Button> */}
                        </div>
                    )}

                    {previewSource && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(previewSource, '_blank')}
                            className="text-sm"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    )}
                </div>
            </div>

            <div
                ref={containerRef}
                className="flex-1 overflow-hidden bg-slate-50 relative"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'default') }}
            >
                <div className="h-full flex items-center justify-center">
                    {(isBase64 || document.type === 'image') && previewSource ? (
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                            <div
                                className="absolute"
                                style={{
                                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    transformOrigin: 'center',
                                    transition: isDragging ? 'none' : 'transform 0.1s ease',
                                }}
                            >
                                <img
                                    ref={imageRef}
                                    src={previewSource}
                                    alt={document.label}
                                    className="max-w-none select-none"
                                    draggable="false"
                                />
                            </div>

                            {/* Zoom instructions overlay */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full shadow-lg">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Scroll to zoom
                                    </span>
                                    <span className="h-3 w-px bg-white/50" />
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l4 4 4-4M7 17l4-4 4 4" />
                                        </svg>
                                        Drag to pan
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : previewSource ? (
                        <div className="w-full h-full max-h-[70vh] flex flex-col bg-white rounded-lg shadow-inner border border-slate-200 overflow-hidden">
                            <div className="flex-1 relative">
                                <iframe
                                    src={previewSource}
                                    className="absolute inset-0 w-full h-full"
                                    title={document.label}
                                />
                            </div>
                            <div className="p-4 border-t border-slate-200 bg-white">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-slate-600">
                                        Viewing {document.file?.name || 'document'}
                                    </p>
                                    <a
                                        href={previewSource}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4"
                                        >
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" x2="21" y1="14" y2="3" />
                                        </svg>
                                        Open in New Tab
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-12 h-12 text-slate-400"
                                >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-medium text-slate-700 mb-2">
                                No Preview Available
                            </h4>
                            <p className="text-slate-500 text-sm">
                                {document.file
                                    ? 'This document type cannot be previewed. Download the file to view its contents.'
                                    : 'Upload a document to see the preview here.'}
                            </p>
                            {document.file && previewSource && (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => window.open(previewSource, '_blank')}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Document
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}