import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';

interface ImageUploadDropzoneProps {
  onImageUpload: (file: File) => void;
  tintColor?: string;
}

export function ImageUploadDropzone({ onImageUpload, tintColor }: ImageUploadDropzoneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 max-w-full object-contain"
              style={tintColor ? {
                filter: `brightness(0.7) sepia(1) hue-rotate(${
                  tintColor === 'red' ? '0deg' :
                  tintColor === 'blue' ? '200deg' :
                  tintColor === 'green' ? '120deg' : '0deg'
                }) saturate(5)`
              } : {}}
            />
            {tintColor && (
              <div className="absolute inset-0 bg-black opacity-10 pointer-events-none" />
            )}
          </div>
          <Button variant="outline">Change Image</Button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image here, or click to select'}
          </p>
          <Button variant="outline" className="mt-4">
            Select Image
          </Button>
        </div>
      )}
    </div>
  );
}
