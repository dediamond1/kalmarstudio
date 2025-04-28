declare module '@/lib/api/payments' {
  interface PaymentIntentRequest {
    amount: number;
    currency: string;
    items?: Array<{
      productId: string;
      quantity: number;
    }>;
  }

  export function createPaymentIntent(data: PaymentIntentRequest): Promise<{
    clientSecret: string;
  }>;
}
