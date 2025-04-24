"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Category } from "@/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchTopLevelCategories();
  }, []);

  const fetchTopLevelCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories?parentId=null");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch categories");
      }

      setCategories(result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryExpand = async (categoryId: string) => {
    // If it's already expanded, just toggle the UI state
    if (expandedCategories[categoryId]) {
      setExpandedCategories({
        ...expandedCategories,
        [categoryId]: !expandedCategories[categoryId],
      });
      return;
    }

    // If not yet expanded, fetch subcategories and then expand
    try {
      const response = await fetch(`/api/categories?parentId=${categoryId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch subcategories");
      }

      // Update the parent category with its subcategories
      const updatedCategories = categories.map((category) =>
        category.id === categoryId
          ? { ...category, subcategories: result.data }
          : category
      );

      setCategories(updatedCategories);

      // Mark as expanded
      setExpandedCategories({
        ...expandedCategories,
        [categoryId]: true,
      });
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch subcategories"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete category");
      }

      // Remove from state - handle both top-level and subcategories
      const newCategories = categories.filter((category) => {
        if (category.id === id) return false;

        // If this is a parent with subcategories, check if the deleted one is a subcategory
        if (category.subcategories && category.subcategories.length > 0) {
          category.subcategories = category.subcategories.filter(
            (subcat) => subcat.id !== id
          );
        }

        return true;
      });

      setCategories(newCategories);
      toast.success("Category deleted successfully");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category"
      );
    }
  };

  const renderCategoryRow = (category: Category, isSubcategory = false) => {
    const hasSubcategories =
      (category.subcategories && category.subcategories.length > 0) ||
      (!expandedCategories[category.id] && category.id); // Allow expansion if not yet expanded

    return (
      <React.Fragment key={category.id}>
        <TableRow
          className={`
            cursor-pointer hover:bg-muted/50
            ${isSubcategory ? "bg-muted/20" : ""}
          `}
        >
          <TableCell className="w-[40%]">
            <div className="flex items-center gap-2">
              {hasSubcategories && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryExpand(category.id);
                  }}
                >
                  {expandedCategories[category.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
              {isSubcategory && <div className="w-4"></div>}
              <div className="font-medium">{category.name}</div>
            </div>
            <div className="text-xs text-muted-foreground ml-6">
              {isSubcategory ? "" : category.description}
            </div>
          </TableCell>
          <TableCell className="text-center">
            <Badge
              className="text-xs"
              variant={isSubcategory ? "outline" : "default"}
            >
              {isSubcategory ? "Subcategory" : "Category"}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={category.isActive ? "default" : "outline"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </TableCell>
          <TableCell className="text-center">{category.sortOrder}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/categories/${category.id}`}>
                    View details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/categories/${category.id}/edit`}>
                    Edit
                  </Link>
                </DropdownMenuItem>
                {!isSubcategory && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/categories/new?parentId=${category.id}`}
                    >
                      Add subcategory
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCategoryToDelete(category.id);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>

        {/* Render subcategories if expanded */}
        {expandedCategories[category.id] &&
          category.subcategories &&
          category.subcategories.map((subcategory) =>
            renderCategoryRow(subcategory, true)
          )}
      </React.Fragment>
    );
  };

  const filteredCategories = categories.filter((category) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    const nameMatches = category.name.toLowerCase().includes(searchLower);
    const descMatches =
      category.description?.toLowerCase().includes(searchLower) || false;

    // Also search in subcategories if they're loaded
    const hasMatchingSubcategory =
      category.subcategories?.some((subcat) =>
        subcat.name.toLowerCase().includes(searchLower)
      ) || false;

    return nameMatches || descMatches || hasMatchingSubcategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories and subcategories
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search categories..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <p>Loading categories...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
              <p className="text-muted-foreground">No categories found</p>
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search query
                </p>
              )}
              {!searchQuery && (
                <Button asChild>
                  <Link href="/dashboard/categories/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first category
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name / Description</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) =>
                renderCategoryRow(category)
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone and may affect products in this category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (categoryToDelete) {
                  handleDelete(categoryToDelete);
                  setDeleteConfirmOpen(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
