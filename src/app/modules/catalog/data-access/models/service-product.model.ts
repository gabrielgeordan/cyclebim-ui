// src/app/modules/catalog/data-access/models/service-product.model.ts

import { BaseProduct } from './base-product.model';
import { ProductType } from './product-type.enum';

export interface ServiceScheduleSlot {
  readonly dayOfWeek: number;
  readonly startHour: string;
  readonly endHour: string;
}

export interface ServiceProduct extends BaseProduct {
  readonly type: ProductType.SERVICE;
  readonly requiresShipping: false;
  readonly estimatedDurationHours: number;
  readonly requiresScheduling: true;
  readonly availableScheduleSlots: readonly ServiceScheduleSlot[];
}
