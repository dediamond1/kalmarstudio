'use client'

import { useCartStore } from '@/store/cart'
import Image from 'next/image'

export default function OrderSummary() {
    const items = useCartStore(state => state.items)
    const subtotal = useCartStore(state =>
        state.items.reduce(
            (sum, item) => sum + (item.price * item.totalQuantity),
            0
        )
    )
    const shipping = 5.99
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    return (
        <div className="w-[300px] sticky top-4">
            <h3 className="text-lg font-medium mb-4">Your Order</h3>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        {item.image && <Image
                            src={item.image}
                            width={60}
                            height={60}
                            alt={item.name}
                            className="rounded-md object-cover"
                        />}

                        <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <div className="text-sm text-gray-600">
                                <p>{item.totalQuantity} × ${item.price.toFixed(2)}</p>
                                {item.color && <p>Color: {item.color}</p>}
                                {item.printType && <p>Print: {item.printType}</p>}
                                {item.material && <p>Material: {item.material}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    )
}
