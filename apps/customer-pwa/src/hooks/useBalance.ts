import { useQuery } from '@tanstack/react-query';
import { getWalletBalance } from '@ms-pay/api-client';

export function useBalance() {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: getWalletBalance,
    select: (res) => res.data,
    refetchInterval: 30_000, // poll every 30s
    staleTime: 10_000,
  });
}
