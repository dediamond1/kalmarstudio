"use client";

import { useParams } from "next/navigation";
import { getProduct } from "@/lib/api/products";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductDetails } from "./ProductDetails.client";
import { Product } from "@/types/product";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(id as string);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!loading && !product) {
    notFound();
  }

  if (loading || !product) {
    return <div>Loading...</div>;
  }

  return <ProductDetails product={product} />;
}
