import { CartItem } from '@/store/cart'

export type CheckoutStep = 
  | 'cart'
  | 'customer'
  | 'shipping'
  | 'payment'
  | 'review'
  | 'confirmation'

export interface Address {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface ShippingMethod {
  id: string
  name: string
  price: number
  estimatedDelivery?: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon?: string
}

export interface Customer {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  isGuest: boolean
}

export interface CheckoutState {
  step: CheckoutStep
  customer: Customer | null
  shippingAddress: Address | null
  billingAddress: Address | null
  shippingMethod: ShippingMethod | null
  paymentMethod: PaymentMethod | null
  discountCode: string | null
  cartItems: CartItem[]
  orderNotes: string
}

export type CheckoutAction =
  | { type: 'SET_STEP'; payload: CheckoutStep }
  | { type: 'SET_CUSTOMER'; payload: Customer | null }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: Address | null }
  | { type: 'SET_BILLING_ADDRESS'; payload: Address | null }
  | { type: 'SET_SHIPPING_METHOD'; payload: ShippingMethod | null }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod | null }
  | { type: 'SET_DISCOUNT_CODE'; payload: string | null }
  | { type: 'SET_CART_ITEMS'; payload: CartItem[] }
  | { type: 'SET_ORDER_NOTES'; payload: string }
