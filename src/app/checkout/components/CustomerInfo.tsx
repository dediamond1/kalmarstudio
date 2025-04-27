'use client'

import { useCheckout } from '../context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function CustomerInfo() {
    const { state, dispatch } = useCheckout()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch({ type: 'SET_STEP', payload: 'shipping' })
    }

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6">Customer Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            required
                            className="h-12 px-4 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={state.customer?.firstName || ''}
                            onChange={(e) => dispatch({
                                type: 'SET_CUSTOMER',
                                payload: { ...state.customer, firstName: e.target.value }
                            })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            required
                            className="h-12 px-4 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={state.customer?.lastName || ''}
                            onChange={(e) => dispatch({
                                type: 'SET_CUSTOMER',
                                payload: { ...state.customer, lastName: e.target.value }
                            })}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        className="h-12 px-4 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={state.customer?.email || ''}
                        onChange={(e) => dispatch({
                            type: 'SET_CUSTOMER',
                            payload: { ...state.customer, email: e.target.value }
                        })}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="isGuest"
                        checked={state.customer?.isGuest || false}
                        onCheckedChange={(checked) => dispatch({
                            type: 'SET_CUSTOMER',
                            payload: { ...state.customer, isGuest: Boolean(checked) }
                        })}
                    />
                    <Label htmlFor="isGuest">Check out as guest</Label>
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full">
                        Continue to Shipping
                    </Button>
                </div>
            </form>
        </div>
    )
}
