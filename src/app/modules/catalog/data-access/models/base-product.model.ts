// src/app/modules/catalog/data-access/models/base-product.model.ts

import { ProductType } from './product-type.enum';

export interface ProductAsset {
  readonly id: string;
  readonly preview: string;
  readonly source: string;
}

export interface BaseProduct {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly basePrice: number;
  readonly currencyCode: string;
  readonly featuredAsset?: ProductAsset;
  readonly assets: readonly ProductAsset[];
  readonly channelId: string;
  readonly vendorId: string;
  readonly vendorName: string;
  readonly isActive: boolean;
  readonly requiresShipping: boolean;
  readonly type: ProductType;
}
