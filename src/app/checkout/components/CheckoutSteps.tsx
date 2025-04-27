'use client'

import { useCheckout } from '../context'
import { Check } from 'lucide-react'

const steps = [
    { id: 'customer', name: 'Customer Info' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'payment', name: 'Payment' },
    { id: 'review', name: 'Review Order' },
    { id: 'confirmation', name: 'Confirmation' }
]

export default function CheckoutSteps() {
    const { state } = useCheckout()

    return (
        <nav className="w-full py-6">
            <ol className="flex items-center justify-between w-full relative">
                {steps.map((step, index) => {
                    const isCurrent = state.step === step.id
                    const isCompleted = steps.findIndex(s => s.id === state.step) > index

                    return (
                        <li key={step.id} className="flex items-center gap-3">
                            <div className={`flex flex-col items-center z-10 ${index !== steps.length - 1 ? 'w-full' : ''}`}>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCurrent ? "border-blue-600 bg-white text-blue-600" :
                                    isCompleted ? "border-green-500 bg-green-500 text-white" :
                                        "border-gray-300 bg-white text-gray-400"
                                    }`}>
                                    {isCompleted ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                {index !== steps.length - 1 && (
                                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                )}
                                <span className={`mt-2 text-xs font-medium ${isCurrent ? "text-blue-600" :
                                    isCompleted ? "text-green-600" :
                                        "text-gray-400"
                                    }`}>
                                    {step.name}
                                </span>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
