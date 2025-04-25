"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CreditCard } from "lucide-react";

interface OrderStatsCardsProps {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    value: string;
}

export function OrderStatsCards({
    total,
    pending,
    processing,
    completed,
    cancelled,
    value
}: OrderStatsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        All Orders
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                    <p className="text-2xl font-bold">{total}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Pending
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                    <p className="text-2xl font-bold">{pending}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Processing
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                    <p className="text-2xl font-bold">{processing}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Completed
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                    <p className="text-2xl font-bold">{completed}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Cancelled
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                    <p className="text-2xl font-bold">{cancelled}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Total Value
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-1">
                    <p className="text-2xl font-bold">${value}</p>
                </CardContent>
            </Card>
        </div>
    );
}
