import React, { useRef, useEffect } from 'react';
import { Button } from './button';

interface ShirtCanvasProps {
  imageUrl: string | null;
  tintColor?: string;
  onImageChange: (position: { x: number; y: number; scale: number }) => void;
}

export function ShirtCanvas({ imageUrl, tintColor, onImageChange }: ShirtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw shirt template (placeholder)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw neck and sleeves (simplified shirt shape)
    ctx.fillStyle = tintColor || '#ffffff';
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(300, 50);
    ctx.lineTo(350, 150);
    ctx.lineTo(300, 400);
    ctx.lineTo(100, 400);
    ctx.lineTo(50, 150);
    ctx.closePath();
    ctx.fill();

    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        const centerX = canvas.width / 2 - (img.width * position.scale) / 2 + position.x;
        const centerY = canvas.height / 2 - (img.height * position.scale) / 2 + position.y;
        
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(
          img,
          centerX,
          centerY,
          img.width * position.scale,
          img.height * position.scale
        );
        ctx.restore();
      };
      img.src = imageUrl;
    }
  }, [imageUrl, position, tintColor]);

  const handleDrag = (e: React.MouseEvent) => {
    if (!imageUrl) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPosition({
        ...startPos,
        x: startPos.x + dx,
        y: startPos.y + dy
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      onImageChange(position);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        onMouseDown={handleDrag}
        className="border border-gray-300 rounded-lg cursor-move"
      />
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => setPosition(p => ({ ...p, scale: Math.min(2, p.scale + 0.1) }))}
        >
          Zoom In
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setPosition(p => ({ ...p, scale: Math.max(0.5, p.scale - 0.1) }))}
        >
          Zoom Out
        </Button>
      </div>
    </div>
  );
}
