'use client'

import { useCheckout } from '../context'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useEffect } from 'react'
import Image from 'next/image'

export default function CartReview() {
    const { state, dispatch } = useCheckout()
    const { items, removeItem, updateSizeQuantity, removeSize } = useCartStore()

    // Sync cart store with checkout state
    useEffect(() => {
        dispatch({ type: 'SET_CART_ITEMS', payload: items })
    }, [items, dispatch])

    const subtotal = items.reduce(
        (sum, item) => sum + item.price *
            item.sizes.reduce((sizeSum, size) => sizeSum + size.quantity, 0),
        0
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
                {items.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 relative bg-gray-100 rounded-md">

                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                                        {item.sizes.map((size, index) => (
                                            <div key={index} className="flex items-center gap-4 mt-2">
                                                <div className="space-y-1">
                                                    <span>Size: {size.size}</span>
                                                    {item.printType && <p className="text-sm text-muted-foreground">Print: {item.printType}</p>}
                                                    {item.material && <p className="text-sm text-muted-foreground">Material: {item.material}</p>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateSizeQuantity(
                                                                item.productId,
                                                                size.size,
                                                                Math.max(1, size.quantity - 1)
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </Button>
                                                    <span>{size.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateSizeQuantity(
                                                                item.productId,
                                                                size.size,
                                                                size.quantity + 1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSize(item.productId, size.size)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="border rounded-lg p-6 h-fit">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Calculated at next step</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-semibold">
                        <span>Estimated Total</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                </div>

                <Button
                    className="w-full mt-6"
                    onClick={() => dispatch({ type: 'SET_STEP', payload: 'customer' })}
                    disabled={items.length === 0}
                >
                    Proceed to Customer Info
                </Button>
            </div>
        </div>
    )
}
