// src/app/modules/catalog/data-access/models/product.model.ts

import { PhysicalProduct } from './physical-product.model';
import { ProductType } from './product-type.enum';
import { RentalProduct } from './rental-product.model';
import { ServiceProduct } from './service-product.model';
import { SurplusProduct } from './surplus-product.model';

export type Product =
  | PhysicalProduct
  | ServiceProduct
  | SurplusProduct
  | RentalProduct;

export const isPhysicalProduct = (product: Product): product is PhysicalProduct =>
  product.type === ProductType.PHYSICAL;

export const isServiceProduct = (product: Product): product is ServiceProduct =>
  product.type === ProductType.SERVICE;

export const isSurplusProduct = (product: Product): product is SurplusProduct =>
  product.type === ProductType.SURPLUS_STOCK;

export const isRentalProduct = (product: Product): product is RentalProduct =>
  product.type === ProductType.RENTAL;

export interface ProductPricingContext {
  readonly quantity: number;
  readonly rentalDays?: number;
}

export interface ProductStrategy {
  calculateTotalPrice(product: Product, context: ProductPricingContext): number;
  validateAvailability(product: Product, context: ProductPricingContext): boolean;
  requiresShippingCalculation(): boolean;
}
