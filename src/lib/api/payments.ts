import { handleApiResponse } from '@/lib/utils';

interface PaymentIntentRequest {
  amount: number;
  currency: string;
}

export async function createPaymentIntent(data: PaymentIntentRequest) {
  return handleApiResponse(
    await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  );
}
