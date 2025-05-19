import React, { useState } from "react";
import { ImageUploadDropzone } from "../ui/ImageUploadDropzone";
import { ShirtCanvas } from "../ui/ShirtCanvas";
import Container from "../ui/Container";

type ShirtDesignerProps = {
  colors: string[];
};

export const ShirtDesigner = (props: ShirtDesignerProps) => {
  const { colors } = props;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tintColor, setTintColor] = useState<string>("red");
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0, scale: 1 });

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImagePosition({ x: 0, y: 0, scale: 1 });
  };

  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Upload Your Design</h2>
        <ImageUploadDropzone
          onImageUpload={handleImageUpload}
          tintColor={tintColor}
        />

        <div className="space-y-2">
          <h3 className="font-medium">Shirt Color</h3>
          <div className="flex gap-2">
            {colors?.map((color) => (
              <button
                key={color}
                onClick={() => setTintColor(color)}
                className={`w-8 h-8 rounded-full ${tintColor === color ? "ring-2 ring-offset-2 ring-gray-400" : "ring-1 ring-offset-1 ring-gray-200"}`}
                style={{ backgroundColor: color.toLowerCase() }}
                aria-label={`${color} shirt`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* <div className="space-y-4">
        <h2 className="text-xl font-bold">Preview Design</h2>
        <ShirtCanvas
          imageUrl={imageUrl}
          tintColor={tintColor}
          onImageChange={setImagePosition}
        />
      </div> */}

      {/* <div className="col-span-full flex justify-center">
        <button
          onClick={() => {
            console.log('Saving design with position:', imagePosition);
            alert(`Design saved!\nPosition: ${JSON.stringify(imagePosition)}`);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!imageUrl}
        >
          Save Design
        </button>
      </div> */}
    </Container>
  );
};
