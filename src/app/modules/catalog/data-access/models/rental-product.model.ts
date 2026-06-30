// src/app/modules/catalog/data-access/models/rental-product.model.ts

import { BaseProduct } from './base-product.model';
import { ProductType } from './product-type.enum';
import { RentalPeriodSpecification } from './rental-period.model';

export interface RentalProduct extends BaseProduct {
  readonly type: ProductType.RENTAL;
  readonly requiresShipping: true;
  readonly inventoryCount: number;
  readonly rentalSpecification: RentalPeriodSpecification;
}
