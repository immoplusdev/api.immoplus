import { IBaseRepository } from '@/core/domain/shared/repositories';
import { Payment } from '@/core/domain/payments';

export interface IPaymentRepository extends IBaseRepository<Payment, Partial<Payment>, Partial<Payment>> {}
