'use client'

import { useCheckout } from '../context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const paymentMethods = [
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳'
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: '🔵'
    },
    {
        id: 'klarna',
        name: 'Klarna',
        icon: '🟢'
    }
]

export default function PaymentInfo() {
    const { state, dispatch } = useCheckout()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch({ type: 'SET_STEP', payload: 'review' })
    }

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6">Payment Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium">Payment Method</h3>
                    <RadioGroup
                        value={state.paymentMethod?.id || ''}
                        onValueChange={(value) => {
                            const method = paymentMethods.find(m => m.id === value)
                            if (method) {
                                dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
                            }
                        }}
                        className="grid gap-4 grid-cols-3"
                    >
                        {paymentMethods.map((method) => (
                            <div key={method.id}>
                                <RadioGroupItem
                                    value={method.id}
                                    id={method.id}
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor={method.id}
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span className="text-2xl mb-2">{method.icon}</span>
                                    <span>{method.name}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {state.paymentMethod?.id === 'card' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={state.paymentDetails?.cardNumber || ''}
                                    onChange={(e) => dispatch({
                                        type: 'SET_PAYMENT_DETAILS',
                                        payload: { ...state.paymentDetails, cardNumber: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        value={state.paymentDetails?.expiry || ''}
                                        onChange={(e) => dispatch({
                                            type: 'SET_PAYMENT_DETAILS',
                                            payload: { ...state.paymentDetails, expiry: e.target.value }
                                        })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input
                                        id="cvc"
                                        placeholder="123"
                                        value={state.paymentDetails?.cvc || ''}
                                        onChange={(e) => dispatch({
                                            type: 'SET_PAYMENT_DETAILS',
                                            payload: { ...state.paymentDetails, cvc: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="nameOnCard">Name on Card</Label>
                                <Input
                                    id="nameOnCard"
                                    value={state.paymentDetails?.nameOnCard || ''}
                                    onChange={(e) => dispatch({
                                        type: 'SET_PAYMENT_DETAILS',
                                        payload: { ...state.paymentDetails, nameOnCard: e.target.value }
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="pt-4">
                    <Button type="submit" className="w-full">
                        Review Order
                    </Button>
                </div>
            </form>
        </div>
    )
}
