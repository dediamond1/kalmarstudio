"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { images as localImages } from "@/constants/images";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index);
  };

  // Default image if no images provided
  const displayImages = images?.length > 0 ? images : [];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          {/* <DialogContent className="max-w-3xl p-0 border-none bg-transparent"> */}
          <div className="relative aspect-square w-full h-full bg-background rounded-lg overflow-hidden">
            <Image
              src={localImages.placeholderImage}
              alt={`${productName} - enlarged view`}
              fill
              className="object-contain p-4"
              priority
            />
          </div>
          {/* </DialogContent> */}
        </Dialog>

        {/* <Image
          src={displayImages[currentImage]}
          alt={`${productName} - image ${currentImage + 1}`}
          fill
          className="object-cover transition-all duration-300 hover:scale-105"
          priority
        /> */}

        {displayImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {displayImages.map((image, index) => (
            <Card
              key={index}
              className={`aspect-square relative overflow-hidden cursor-pointer transition-all ${
                index === currentImage
                  ? "ring-2 ring-primary"
                  : "hover:ring-1 hover:ring-primary/50"
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image}
                alt={`${productName} - thumbnail ${index + 1}`}
                fill
                className="object-cover p-1"
              />
            </Card>
          ))}
        </div>
      )} */}
    </div>
  );
}
