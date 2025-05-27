"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Type, Palette } from "lucide-react";

export default function CustomizePage() {
  const [view, setView] = useState<"front" | "back">("front");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* T-shirt Preview */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full max-w-[600px]">
            <img
              src={`/images/red_${view}.png`}
              alt={`T-shirt ${view} view`}
              className="w-full h-auto border-2 border-gray-200 rounded-lg"
            />
          </div>
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
        <div className="w-full lg:w-64 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Add Design</h2>
            <div className="flex flex-col gap-3">
              <Button variant="outline" size="icon" className="group relative">
                <ImagePlus size={32} />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Add Image
                </span>
              </Button>
              <Button variant="outline" size="icon" className="group relative">
                <Type size={32} />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Add Text
                </span>
              </Button>
              <Button variant="outline" size="icon" className="group relative">
                <Palette size={32} />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Add Art
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
