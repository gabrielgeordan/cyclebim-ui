// src/app/modules/catalog/components/product-card/product-card.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Product,
  ProductType,
  isRentalProduct,
  isServiceProduct,
  isSurplusProduct,
} from '../../data-access/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() readonly selectProduct = new EventEmitter<Product>();

  readonly productTypeEnum = ProductType;

  onSelect(): void {
    this.selectProduct.emit(this.product);
  }

  getBadgeText(): string {
    const strategy: Record<ProductType, string> = {
      [ProductType.RENTAL]: 'LOCAÇÃO / DIÁRIA',
      [ProductType.SERVICE]: 'MÃO DE OBRA / SERVIÇO',
      [ProductType.SURPLUS_STOCK]: 'SOBRAS DE OBRA / LOTE',
      [ProductType.PHYSICAL]: 'MATERIAL FÍSICO',
    };
    return strategy[this.product.type] || 'PRODUTO';
  }

  getPriceLabel(): string {
    if (isRentalProduct(this.product)) {
      return `R$ ${(this.product.rentalSpecification.dailyRate / 100).toFixed(2)} / dia`;
    }
    return `R$ ${(this.product.basePrice / 100).toFixed(2)}`;
  }

  getExtraInfo(): string {
    if (isSurplusProduct(this.product)) {
      return `Raio máx: ${this.product.geolocation.maxShippingRadiusKm} km (${this.product.geolocation.originCity})`;
    }
    if (isServiceProduct(this.product)) {
      return `Duração est.: ${this.product.estimatedDurationHours}h`;
    }
    if (isRentalProduct(this.product)) {
      return `Mínimo: ${this.product.rentalSpecification.minRentalDays} dias`;
    }
    return 'Estoque disponível';
  }
}
