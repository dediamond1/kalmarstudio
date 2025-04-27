'use client'

import { useCheckout } from '../context'
import { Button } from '@/components/ui/button'
import { CartItem } from '@/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function OrderReview() {
    const { state, dispatch } = useCheckout()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            // Submit order to backend
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerId: state.customer?.id || 'guest-' + Date.now(),
                    items: state.cartItems.map((item: CartItem) => ({
                        productId: item.productId,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        quantity: item.totalQuantity,
                        color: item.color,
                        printType: item.printType,
                        material: item.material,
                        sizes: item.sizes
                    })),
                    paymentMethod: state.paymentMethod?.id,
                    shippingAddress: {
                        street: state.shippingAddress?.address1,
                        city: state.shippingAddress?.city,
                        state: state.shippingAddress?.state,
                        postalCode: state.shippingAddress?.postalCode,
                        country: state.shippingAddress?.country
                    },
                    tax: state.cartItems.reduce(
                        (sum: number, item: CartItem) => sum + (item.price * item.totalQuantity * 0.1),
                        0
                    ),
                    shippingCost: state.shippingMethod?.price || 0
                })
            })

            if (!response.ok) throw new Error('Failed to place order')

            const order = await response.json()
            console.log(order, "orderssss")
            dispatch({ type: 'SET_ORDER_ID', payload: order.id })
            dispatch({ type: 'SET_STEP', payload: 'confirmation' })
        } catch (error) {
            console.error('Order submission failed:', error)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to place order. Please try again.' })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>

            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{state.customer?.firstName} {state.customer?.lastName}</p>
                        <p>{state.customer?.email}</p>
                        <Badge variant="outline">
                            {state.customer?.isGuest ? 'Guest Checkout' : 'Registered Customer'}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{state.shippingAddress?.firstName} {state.shippingAddress?.lastName}</p>
                        <p>{state.shippingAddress?.address1}</p>
                        {state.shippingAddress?.address2 && <p>{state.shippingAddress.address2}</p>}
                        <p>{state.shippingAddress?.city}, {state.shippingAddress?.postalCode}</p>
                        <p className="font-medium mt-2">
                            Shipping Method: {state.shippingMethod?.name}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{state.paymentMethod?.name}</p>
                        {state.paymentMethod?.id === 'card' && (
                            <div className="mt-2 space-y-1">
                                <p>•••• •••• •••• {state.paymentDetails?.cardNumber?.slice(-4)}</p>
                                <p>Expires: {state.paymentDetails?.expiry}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Button
                    onClick={handleSubmit}
                    className="w-full mt-6"
                    disabled={state.isLoading}
                >
                    {state.isLoading ? 'Processing...' : 'Place Order'}
                </Button>
            </div>
        </div>
    )
}
