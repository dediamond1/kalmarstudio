import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import { images } from "@/constants/images";

type Props = {
  product: Product;
};

const ProductItem = (props: Props) => {
  const { product } = props;
  return (
    <Link
      href={`/products/${product.id}`}
      key={product.id}
      className="group focus-visible:outline-none"
      aria-label={`View ${product.name} details`}
    >
      <Card className="hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col border-border/50">
        <CardHeader className="p-0 relative overflow-hidden rounded-t-lg">
          <div className="aspect-square relative border-b border-border/30">
            <Image
              src={
                product.imageUrls.length > 0
                  ? product.imageUrls[0]
                  : images.placeholderImage
              }
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={false}
            />
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            {product.discountPrice && (
              <Badge variant="destructive" className="font-semibold">
                SALE
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="secondary" className="font-semibold">
                NEW
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 bg-background/80 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {product.colors
              ?.slice(0, 3)
              .map((color) => (
                <span
                  key={color}
                  className="w-5 h-5 rounded-full border-2 border-border/30 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  aria-label={color}
                  title={color}
                />
              ))}
          </div>
          <div className="mt-2">
            {product.discountPrice ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl text-primary">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.basePrice.toFixed(2)}
                  </span>
                </div>
                <span className="text-xs bg-red-500/10 text-red-600 font-medium px-2 py-0.5 rounded-full w-fit">
                  {Math.round(
                    ((product.basePrice - product.discountPrice) /
                      product.basePrice) *
                      100
                  )}
                  % OFF
                </span>
              </div>
            ) : (
              <span className="font-bold text-xl">
                ${product.basePrice.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            variant="outline"
            size="sm"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductItem;
