import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SearchIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  HeartIcon,
  EyeIcon,
  StarIcon,
} from "lucide-react";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductList } from "@/components/products/product-list";
import { CategoryFilter } from "@/components/products/category-filter";
import { PriceFilter } from "@/components/products/price-filter";
import { getActiveProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import HeroSection from "@/components/HeroSection";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}) {
  const [productsResponse, categories] = await Promise.all([
    getActiveProducts({
      category: searchParams.category,
      sort: searchParams.sort,
      search: searchParams.search,
      minPrice: searchParams.minPrice
        ? Number(searchParams.minPrice)
        : undefined,
      maxPrice: searchParams.maxPrice
        ? Number(searchParams.maxPrice)
        : undefined,
      page: searchParams.page ? Number(searchParams.page) : 1,
      limit: 12,
    }),
    getCategories(),
  ]);

  console.log("Products API response:", productsResponse);
  console.log("Categories API response:", categories);

  // Transform API response to match ProductList expectations
  const { page = 1, pages = 1 } = productsResponse;

  // Helper function to sanitize query parameters
  const sanitizeQuery = (params: typeof searchParams) => {
    return {
      ...(params.category && { category: params.category }),
      ...(params.sort && { sort: params.sort }),
      ...(params.search && { search: params.search }),
      ...(params.minPrice && { minPrice: params.minPrice }),
      ...(params.maxPrice && { maxPrice: params.maxPrice }),
    };
  };

  const transformedProducts = productsResponse?.map((product) => ({
    ...product,
    imageUrls: product.imageUrls || [], // Use existing or empty array
    discountPrice: product.discountPrice || product.basePrice * 0.9,
    isNew: product.isNew || false,
    colors: product.colors || [],
    materials: product.materials || [],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <HeroSection
        title="Premium Products"
        description="Discover our curated collection of high-quality items"
      />

      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Floating Filter Toggle for Mobile */}
          <Button
            variant="outline"
            className="lg:hidden fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg"
          >
            <FilterIcon className="w-5 h-5" />
          </Button>
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72">
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={searchParams?.category}
                  />
                </div>

                <PriceFilter />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Sort By</h3>
                  <Select
                    name="sort"
                    defaultValue={searchParams?.sort || "newest"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name">Name: A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search products..."
                  defaultValue={searchParams.search || ""}
                  className="pl-10"
                />
              </div>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card
                      key={i}
                      className="hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-0 group">
                        <div className="aspect-square bg-muted/50 rounded-t-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              }
            >
              <ProductList products={transformedProducts} />

              {/* Pagination */}
              <div className="mt-8 flex justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={{
                      pathname: "/products",
                      query: {
                        ...sanitizeQuery(searchParams),
                        page: String(page - 1),
                      },
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-accent"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={{
                      pathname: "/products",
                      query: {
                        ...sanitizeQuery(searchParams),
                        page: String(p),
                      },
                    }}
                    className={`px-4 py-2 border rounded-md ${
                      p === page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < pages && (
                  <Link
                    href={{
                      pathname: "/products",
                      query: {
                        ...sanitizeQuery(searchParams),
                        page: String(page + 1),
                      },
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-accent"
                  >
                    Next
                  </Link>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
