import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'

export interface PaymentSummary {
  totalPaid: number
  remainingCoupons: number
  remainingPrincipal: number
}

export function usePaymentSummary(instrumentId: number): PaymentSummary {
  const payments = useLiveQuery(
    () => db.paymentRecords.where('instrumentId').equals(instrumentId).toArray(),
    [instrumentId],
    [],
  )

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.actualAmount ?? p.expectedAmount), 0)

  const remainingCoupons = payments
    .filter((p) => p.status === 'scheduled' && p.type === 'coupon')
    .reduce((sum, p) => sum + p.expectedAmount, 0)

  const remainingPrincipal = payments
    .filter((p) => p.status === 'scheduled' && p.type === 'redemption')
    .reduce((sum, p) => sum + p.expectedAmount, 0)

  return { totalPaid, remainingCoupons, remainingPrincipal }
}
