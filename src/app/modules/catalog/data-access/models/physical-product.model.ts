// src/app/modules/catalog/data-access/models/physical-product.model.ts

import { BaseProduct } from './base-product.model';
import { ProductType } from './product-type.enum';

export interface PhysicalProductDimensions {
  readonly weightKg: number;
  readonly widthCm: number;
  readonly heightCm: number;
  readonly lengthCm: number;
}

export interface PhysicalProduct extends BaseProduct {
  readonly type: ProductType.PHYSICAL;
  readonly requiresShipping: true;
  readonly stockLevel: number;
  readonly sku: string;
  readonly dimensions?: PhysicalProductDimensions;
}
