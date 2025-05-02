import { IBaseRepository } from '@/core/domain/common/repositories';
import { Payment } from '@/core/domain/payments';

export interface IPaymentRepository extends IBaseRepository<Payment, Partial<Payment>, Partial<Payment>> {}
