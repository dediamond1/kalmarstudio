'use client'

import { useCheckout } from '../context'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
    { id: 'cart', name: 'Cart' },
    { id: 'customer', name: 'Customer' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'payment', name: 'Payment' },
    { id: 'review', name: 'Review' },
    { id: 'confirmation', name: 'Confirmation' }
]

export default function CheckoutStepper() {
    const { state } = useCheckout()

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Checkout</h2>
            <nav>
                <ol className="space-y-4">
                    {steps.map((step, index) => {
                        const isCurrent = state.step === step.id
                        const isCompleted = steps.findIndex(s => s.id === state.step) > index

                        return (
                            <li key={step.id} className="flex items-center gap-3">
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full",
                                    isCurrent ? "bg-primary text-primary-foreground" :
                                        isCompleted ? "bg-green-100 text-green-800" :
                                            "bg-gray-100 text-gray-500"
                                )}>
                                    {isCompleted ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-sm font-medium",
                                    isCurrent ? "text-primary" :
                                        isCompleted ? "text-green-800" :
                                            "text-gray-500"
                                )}>
                                    {step.name}
                                </span>
                            </li>
                        )
                    })}
                </ol>
            </nav>
        </div>
    )
}
