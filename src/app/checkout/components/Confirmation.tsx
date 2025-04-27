'use client'

import { useCheckout } from '../context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Confirmation() {
    const { state } = useCheckout()

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6">Order Confirmation</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Thank you for your order!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>Your order #{state.orderId} has been received.</p>

                    <div className="space-y-2">
                        <h3 className="font-medium">What's next?</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>You'll receive an order confirmation email shortly</li>
                            <li>We'll notify you when your order ships</li>
                            {state.paymentMethod?.id === 'card' && (
                                <li>Your payment has been processed</li>
                            )}
                        </ul>
                    </div>

                    <div className="pt-4">
                        <Button asChild className="w-full">
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
