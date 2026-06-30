// src/app/modules/catalog/data-access/models/surplus-product.model.ts

import { BaseProduct } from './base-product.model';
import { GeolocationConstraint } from './geolocation.model';
import { ProductType } from './product-type.enum';

export interface SurplusProduct extends BaseProduct {
  readonly type: ProductType.SURPLUS_STOCK;
  readonly requiresShipping: true;
  readonly exactStockLevel: number;
  readonly isLotSale: boolean;
  readonly geolocation: GeolocationConstraint;
}
