'use client'

import { CheckoutProvider } from './context'
import CheckoutLayout from './CheckoutLayout'
import { Toaster } from '@/components/ui/sonner'

export default function CheckoutPage() {
    return (
        <CheckoutProvider>
            <CheckoutLayout />
            <Toaster position="top-center" />
        </CheckoutProvider>
    )
}
