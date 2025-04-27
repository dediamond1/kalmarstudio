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

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  if (products?.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products?.map((product) => (
        <Link
          href={`/products/${product.id}`}
          key={product.id}
          className="group focus-visible:outline-none"
          aria-label={`View ${product.name} details`}
        >
          <Card className="hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col border-border/50">
            <CardHeader className="p-0 relative overflow-hidden rounded-t-lg">
              <div className="aspect-square relative">
                {product.imageUrls?.length > 0 ? (
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={false}
                  />
                ) : (
                  <div className="bg-muted/50 w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <div className="absolute top-2 left-2 flex gap-2">
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
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.8</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.colors
                  ?.slice(0, 3)
                  .map((color) => (
                    <span
                      key={color}
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    />
                  ))}
              </div>
              <div className="mt-2">
                {product.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.basePrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-red-500 font-medium">
                      {Math.round(
                        ((product.basePrice - product.discountPrice) /
                          product.basePrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-lg">
                    ${product.basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
