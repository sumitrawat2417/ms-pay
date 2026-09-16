import { useQuery } from '@tanstack/react-query';
import { getMerchantDashboard } from '@ms-pay/api-client';

export function useMerchantDashboard() {
  return useQuery({
    queryKey: ['merchant-dashboard'],
    queryFn: getMerchantDashboard,
    select: (res) => res.data,
    refetchInterval: 30_000, // poll every 30s
    staleTime: 10_000,
  });
}
