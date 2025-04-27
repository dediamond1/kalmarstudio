'use client'

import { useCheckout } from '../context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

const shippingMethods = [
    {
        id: 'standard',
        name: 'Standard Shipping',
        price: 5.99,
        estimatedDelivery: '3-5 business days'
    },
    {
        id: 'express',
        name: 'Express Shipping',
        price: 12.99,
        estimatedDelivery: '1-2 business days'
    },
    {
        id: 'pickup',
        name: 'Store Pickup',
        price: 0,
        estimatedDelivery: 'Ready in 1 hour'
    }
]

export default function ShippingInfo() {
    const { state, dispatch } = useCheckout()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch({ type: 'SET_STEP', payload: 'payment' })
    }

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium">Shipping Address</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                required
                                value={state.shippingAddress?.firstName || ''}
                                onChange={(e) => dispatch({
                                    type: 'SET_SHIPPING_ADDRESS',
                                    payload: { ...state.shippingAddress, firstName: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                required
                                value={state.shippingAddress?.lastName || ''}
                                onChange={(e) => dispatch({
                                    type: 'SET_SHIPPING_ADDRESS',
                                    payload: { ...state.shippingAddress, lastName: e.target.value }
                                })}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address1">Address</Label>
                        <Input
                            id="address1"
                            required
                            value={state.shippingAddress?.address1 || ''}
                            onChange={(e) => dispatch({
                                type: 'SET_SHIPPING_ADDRESS',
                                payload: { ...state.shippingAddress, address1: e.target.value }
                            })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                        <Input
                            id="address2"
                            value={state.shippingAddress?.address2 || ''}
                            onChange={(e) => dispatch({
                                type: 'SET_SHIPPING_ADDRESS',
                                payload: { ...state.shippingAddress, address2: e.target.value }
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                required
                                value={state.shippingAddress?.city || ''}
                                onChange={(e) => dispatch({
                                    type: 'SET_SHIPPING_ADDRESS',
                                    payload: { ...state.shippingAddress, city: e.target.value }
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                                id="postalCode"
                                required
                                value={state.shippingAddress?.postalCode || ''}
                                onChange={(e) => dispatch({
                                    type: 'SET_SHIPPING_ADDRESS',
                                    payload: { ...state.shippingAddress, postalCode: e.target.value }
                                })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium">Shipping Method</h3>
                    <RadioGroup
                        value={state.shippingMethod?.id || ''}
                        onValueChange={(value) => {
                            const method = shippingMethods.find(m => m.id === value)
                            if (method) {
                                dispatch({ type: 'SET_SHIPPING_METHOD', payload: method })
                            }
                        }}
                        className="space-y-3"
                    >
                        {shippingMethods.map((method) => (
                            <div key={method.id} className="flex items-center space-x-3">
                                <RadioGroupItem value={method.id} id={method.id} />
                                <Label htmlFor={method.id} className="flex-1">
                                    <div className="flex justify-between">
                                        <span>{method.name}</span>
                                        <span>${method.price.toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {method.estimatedDelivery}
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full">
                        Continue to Payment
                    </Button>
                </div>
            </form>
        </div>
    )
}
