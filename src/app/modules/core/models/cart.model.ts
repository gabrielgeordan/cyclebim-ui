// src/app/modules/core/models/cart.model.ts

import { ProductType } from '../../catalog/data-access/models';

export interface CartLineItem {
  readonly id: string;
  readonly productVariantId: string;
  readonly productId: string;
  readonly productName: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly linePrice: number;
  readonly productDomainType: ProductType;
  readonly rentalStartDate?: string;
  readonly rentalEndDate?: string;
  readonly rentalDaysCount?: number;
  readonly scheduledServiceSlotDay?: number;
  readonly scheduledServiceSlotTime?: string;
}

export interface CartSummary {
  readonly id: string;
  readonly code: string;
  readonly lines: readonly CartLineItem[];
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
}
