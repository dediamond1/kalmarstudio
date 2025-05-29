"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface FabricImage {
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  originX: string;
  originY: string;
  set: (options: {
    originX: string;
    originY: string;
    scaleX: number;
    scaleY: number;
  }) => void;
}

interface FabricCanvas {
  backgroundImage: FabricImage | null;
  width: number;
  height: number;
  setBackgroundImage: (
    img: HTMLImageElement,
    callback: () => void,
    options: { crossOrigin: string }
  ) => void;
  renderAll: () => void;
  add: (obj: {
    left: number;
    top: number;
    scaleX: number;
    scaleY: number;
    src: string;
  }) => void;
  dispose: () => void;
}

export default function CustomizePage() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<"front" | "back">("front");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasElRef.current || typeof window === "undefined") return;

    const initFabric = async () => {
      const fabric = await import("fabric");
      const canvas = new fabric.default.Canvas(canvasElRef.current!, {
        selection: true,
        preserveObjectStacking: true,
      });
      fabricCanvasRef.current = canvas as unknown as FabricCanvas;

      loadTshirtImage();

      return () => canvas.dispose();
    };

    initFabric();
  }, []);

  // Update t-shirt when view changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      loadTshirtImage();
    }
  }, [view]);

  const loadTshirtImage = async () => {
    if (!fabricCanvasRef.current) return;

    const imgUrl =
      view === "front" ? "/images/red_front.png" : "/images/red_back.png";
    fabricCanvasRef.current.backgroundImage = null;

    const fabricModule = await import("fabric");
    const fabric = fabricModule.default;
    fabric.Image.fromURL(
      imgUrl,
      (img) => {
        img.set({
          originX: "left",
          originY: "top",
          scaleX: fabricCanvasRef.current!.width! / img.width!,
          scaleY: fabricCanvasRef.current!.height! / img.height!,
        img.set({
          originX: "left",
          originY: "top",
          scaleX: fabricCanvasRef.current!.width! / img.width!,
          scaleY: fabricCanvasRef.current!.height! / img.height!,
        });
        fabricCanvasRef.current?.setBackgroundImage(
          img,
          () => {
            fabricCanvasRef.current?.renderAll();
          },
          {
            crossOrigin: "anonymous",
          }
        );
      },
      {
        crossOrigin: "anonymous",
      }
    );
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fabricCanvasRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          fabricCanvasRef.current?.add({
            left: 100,
            top: 100,
            scaleX: 0.5,
            scaleY: 0.5,
            src: img.src,
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* T-shirt Preview */}
        <div className="relative">
          <canvas
            ref={canvasElRef}
            width={800}
            height={800}
            className="w-full aspect-square border"
          />
          <div className="flex gap-4 mt-4">
            <Button
              variant={view === "front" ? "default" : "outline"}
              onClick={() => setView("front")}
            >
              Front View
            </Button>
            <Button
              variant={view === "back" ? "default" : "outline"}
              onClick={() => setView("back")}
            >
              Back View
            </Button>
          </div>
        </div>

        {/* Design Controls */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Add Images</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAddImage}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <ImagePlus size={20} />
              Upload Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
