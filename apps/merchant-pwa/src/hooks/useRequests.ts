import { useQuery } from '@tanstack/react-query';
import { getPaymentRequests } from '@ms-pay/api-client';

export function useRequests() {
  return useQuery({
    queryKey: ['payment-requests'],
    queryFn: getPaymentRequests,
    select: (res) => res.data,
    refetchInterval: 15_000, // poll every 15s — requests are time-sensitive
    staleTime: 5_000,
  });
}

export function usePendingRequestCount() {
  const { data } = useRequests();
  return data?.filter((r) => r.status === 'pending').length ?? 0;
}
