export async function handleApiResponse<T = any>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

export function cn(...inputs: (string | undefined | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .map(input => typeof input === 'string' ? input.trim() : '')
    .filter(Boolean)
    .join(' ');
}
