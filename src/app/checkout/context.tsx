'use client'

import { createContext, useContext, useReducer } from 'react'
import { CheckoutState, CheckoutAction } from './types'

const CheckoutContext = createContext<{
    state: CheckoutState
    dispatch: React.Dispatch<CheckoutAction>
} | undefined>(undefined)

const initialState: CheckoutState = {
    step: 'cart',
    customer: null,
    shippingAddress: null,
    billingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    discountCode: null,
    cartItems: [],
    orderNotes: '',
}

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload }
        case 'SET_CUSTOMER':
            return { ...state, customer: action.payload }
        case 'SET_SHIPPING_ADDRESS':
            return { ...state, shippingAddress: action.payload }
        case 'SET_BILLING_ADDRESS':
            return { ...state, billingAddress: action.payload }
        case 'SET_SHIPPING_METHOD':
            return { ...state, shippingMethod: action.payload }
        case 'SET_PAYMENT_METHOD':
            return { ...state, paymentMethod: action.payload }
        case 'SET_DISCOUNT_CODE':
            return { ...state, discountCode: action.payload }
        case 'SET_CART_ITEMS':
            return { ...state, cartItems: action.payload }
        case 'SET_ORDER_NOTES':
            return { ...state, orderNotes: action.payload }
        default:
            return state
    }
}

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(checkoutReducer, initialState)

    return (
        <CheckoutContext.Provider value={{ state, dispatch }}>
            {children}
        </CheckoutContext.Provider>
    )
}

export function useCheckout() {
    const context = useContext(CheckoutContext)
    if (context === undefined) {
        throw new Error('useCheckout must be used within a CheckoutProvider')
    }
    return context
}
