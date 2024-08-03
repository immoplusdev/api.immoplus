import { IBaseRepository } from '@/core/domain/shared/repositories';
import { Reservation } from '@/core/domain/reservations';


export interface IReservationRepository extends IBaseRepository<Reservation, Partial<Reservation>, Partial<Reservation>> {}
