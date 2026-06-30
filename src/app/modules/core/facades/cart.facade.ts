// src/app/modules/core/facades/cart.facade.ts

import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ProductType } from '../../catalog/data-access/models';
import { CartSummary } from '../models/cart.model';
import { VendureGraphqlService } from '../services/vendure-graphql.service';

interface AddToCartPayload {
  readonly productVariantId: string;
  readonly quantity: number;
  readonly rentalStartDate?: string;
  readonly rentalEndDate?: string;
  readonly rentalDaysCount?: number;
  readonly scheduledServiceSlotDay?: number;
  readonly scheduledServiceSlotTime?: string;
}

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly graphqlService = inject(VendureGraphqlService);

  private readonly _cart = signal<CartSummary | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  readonly cart = computed(() => this._cart());
  readonly isLoading = computed(() => this._isLoading());
  readonly totalItems = computed(() =>
    this._cart()?.lines.reduce((acc, line) => acc + line.quantity, 0) ?? 0
  );

  constructor() {
    effect(
      () => {
        this.loadActiveCart();
      },
      { allowSignalWrites: true }
    );
  }

  loadActiveCart(): void {
    this._isLoading.set(true);
    const query = `
      query GetActiveOrder {
        activeOrder {
          id
          code
          subtotalWithTax
          shippingWithTax
          totalWithTax
          lines {
            id
            quantity
            linePriceWithTax
            unitPriceWithTax
            productVariant {
              id
              name
              product {
                id
                name
                customFields {
                  productDomainType
                }
              }
            }
            customFields {
              rentalStartDate
              rentalEndDate
              rentalDaysCount
              scheduledServiceSlotDay
              scheduledServiceSlotTime
            }
          }
        }
      }
    `;

    this.graphqlService.query<{ readonly activeOrder: unknown }>(query).subscribe({
      next: response => {
        if (response.activeOrder) {
          this._cart.set(this.mapOrderToCartSummary(response.activeOrder as Record<string, unknown>));
        }
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }

  addItem(payload: AddToCartPayload): void {
    this._isLoading.set(true);
    const mutation = `
      mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!, $customFields: OrderLineCustomFieldsInput) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity, customFields: $customFields) {
          ... on Order {
            id
          }
        }
      }
    `;

    const variables = {
      productVariantId: payload.productVariantId,
      quantity: payload.quantity,
      customFields: {
        rentalStartDate: payload.rentalStartDate ?? '',
        rentalEndDate: payload.rentalEndDate ?? '',
        rentalDaysCount: payload.rentalDaysCount ?? 0,
        scheduledServiceSlotDay: payload.scheduledServiceSlotDay ?? -1,
        scheduledServiceSlotTime: payload.scheduledServiceSlotTime ?? '',
      },
    };

    this.graphqlService.query(mutation, variables).subscribe({
      next: () => this.loadActiveCart(),
      error: () => this._isLoading.set(false),
    });
  }

  private mapOrderToCartSummary(order: Record<string, unknown>): CartSummary {
    const rawLines = (order['lines'] as readonly Record<string, unknown>[]) || [];
    const lines = rawLines.map(line => {
      const variant = (line['productVariant'] as Record<string, unknown>) || {};
      const product = (variant['product'] as Record<string, unknown>) || {};
      const custom = (product['customFields'] as Record<string, unknown>) || {};
      const lineCustom = (line['customFields'] as Record<string, unknown>) || {};

      return {
        id: String(line['id'] || ''),
        productVariantId: String(variant['id'] || ''),
        productId: String(product['id'] || ''),
        productName: String(product['name'] || variant['name'] || ''),
        unitPrice: Number(line['unitPriceWithTax'] || 0),
        quantity: Number(line['quantity'] || 0),
        linePrice: Number(line['linePriceWithTax'] || 0),
        productDomainType: (String(custom['productDomainType'] || 'PHYSICAL')) as ProductType,
        rentalStartDate: String(lineCustom['rentalStartDate'] || ''),
        rentalEndDate: String(lineCustom['rentalEndDate'] || ''),
        rentalDaysCount: Number(lineCustom['rentalDaysCount'] || 0),
        scheduledServiceSlotDay: Number(lineCustom['scheduledServiceSlotDay'] || -1),
        scheduledServiceSlotTime: String(lineCustom['scheduledServiceSlotTime'] || ''),
      };
    });

    return {
      id: String(order['id'] || ''),
      code: String(order['code'] || ''),
      lines,
      subtotal: Number(order['subtotalWithTax'] || 0),
      shipping: Number(order['shippingWithTax'] || 0),
      total: Number(order['totalWithTax'] || 0),
    };
  }
}
