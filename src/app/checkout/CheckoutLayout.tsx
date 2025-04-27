'use client'

import { useCheckout } from './context'
import CheckoutStepper from './components/CheckoutSteps'
import OrderSummary from './components/OrderSummary'
import CustomerInfo from './components/CustomerInfo'
import ShippingInfo from './components/ShippingInfo'
import PaymentInfo from './components/PaymentInfo'
import OrderReview from './components/OrderReview'
import Confirmation from './components/Confirmation'
import './checkout.css'
import { motion } from 'framer-motion'

export default function CheckoutLayout() {
    const { state } = useCheckout()

    const renderStep = () => {
        switch (state.step) {
            case 'customer': return <CustomerInfo />
            case 'shipping': return <ShippingInfo />
            case 'payment': return <PaymentInfo />
            case 'review': return <OrderReview />
            case 'confirmation': return <Confirmation />
            default: return <CustomerInfo />
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-100 py-4 px-6">
                <h1 className="text-xl font-medium">Checkout</h1>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4">
                {/* Progress Steps */}
                <CheckoutStepper />

                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    {/* Form Content */}
                    <div className="lg:w-2/3">
                        <motion.div
                            key={state.step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-[300px] border-l border-gray-200 pl-6">
                        <OrderSummary />
                    </div>
                </div>
            </main>
        </div>
    )
}
