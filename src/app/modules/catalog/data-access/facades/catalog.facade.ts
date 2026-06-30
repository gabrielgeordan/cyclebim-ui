// src/app/modules/catalog/data-access/facades/catalog.facade.ts

import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { VendureGraphqlService } from '../../../core/services/vendure-graphql.service';
import {
  PhysicalProduct,
  Product,
  ProductType,
  RentalProduct,
  ServiceProduct,
  SurplusProduct,
} from '../models';

@Injectable({ providedIn: 'root' })
export class CatalogFacade {
  private readonly graphqlService = inject(VendureGraphqlService);

  private readonly _products = signal<readonly Product[]>([]);
  private readonly _selectedTypeFilter = signal<ProductType | null>(null);
  private readonly _isLoading = signal<boolean>(false);

  readonly products = computed(() => {
    const filter = this._selectedTypeFilter();
    const allProducts = this._products();
    if (!filter) {
      return allProducts;
    }
    return allProducts.filter(p => p.type === filter);
  });

  readonly selectedTypeFilter = computed(() => this._selectedTypeFilter());
  readonly isLoading = computed(() => this._isLoading());

  constructor() {
    effect(
      () => {
        this.loadProducts();
      },
      { allowSignalWrites: true }
    );
  }

  setFilter(type: ProductType | null): void {
    this._selectedTypeFilter.set(type);
  }

  loadProducts(): void {
    this._isLoading.set(true);
    const query = `
      query GetProducts {
        products {
          items {
            id
            name
            slug
            description
            variants {
              id
              priceWithTax
              currencyCode
              stockLevel
              sku
            }
            featuredAsset {
              id
              preview
              source
            }
            customFields {
              productDomainType
              maxShippingRadiusKm
              originLatitude
              originLongitude
              originCity
              originState
              dailyRate
              minRentalDays
              maxRentalDays
              securityDepositAmount
              estimatedDurationHours
              requiresScheduling
            }
          }
        }
      }
    `;

    this.graphqlService
      .query<{
        readonly products: { readonly items: readonly Record<string, unknown>[] };
      }>(query)
      .subscribe({
        next: response => {
          const items = response.products?.items ?? [];
          const mappedProducts = items.map(item =>
            this.mapRawProductToDomain(item)
          );
          this._products.set(mappedProducts);
          this._isLoading.set(false);
        },
        error: () => this._isLoading.set(false),
      });
  }

  private mapRawProductToDomain(raw: Record<string, unknown>): Product {
    const variants = (raw['variants'] as readonly Record<string, unknown>[]) || [];
    const firstVariant = variants[0] || {};
    const custom = (raw['customFields'] as Record<string, unknown>) || {};
    const domainType = (String(custom['productDomainType'] || 'PHYSICAL')) as ProductType;
    const featuredAsset = (raw['featuredAsset'] as Record<string, unknown>) || null;
    const assets = featuredAsset
      ? [
          {
            id: String(featuredAsset['id'] || ''),
            preview: String(featuredAsset['preview'] || featuredAsset['source'] || ''),
            source: String(featuredAsset['source'] || featuredAsset['preview'] || ''),
          },
        ]
      : [];

    const baseProduct = {
      id: String(raw['id'] || ''),
      name: String(raw['name'] || ''),
      slug: String(raw['slug'] || ''),
      description: String(raw['description'] || ''),
      basePrice: Number(firstVariant['priceWithTax'] || 0),
      currencyCode: String(firstVariant['currencyCode'] || 'BRL'),
      assets,
      channelId: 'default',
      vendorId: 'vendor-1',
      vendorName: 'Fornecedor Cyclebim',
      isActive: true,
      requiresShipping: domainType !== ProductType.SERVICE,
    };

    const mapperStrategy: Record<ProductType, () => Product> = {
      [ProductType.PHYSICAL]: (): PhysicalProduct => ({
        ...baseProduct,
        type: ProductType.PHYSICAL,
        requiresShipping: true,
        stockLevel: String(firstVariant['stockLevel']) === 'IN_STOCK' ? 10 : 0,
        sku: String(firstVariant['sku'] || 'SKU-000'),
      }),
      [ProductType.SERVICE]: (): ServiceProduct => ({
        ...baseProduct,
        type: ProductType.SERVICE,
        requiresShipping: false,
        estimatedDurationHours: Number(custom['estimatedDurationHours'] || 8),
        requiresScheduling: true,
        availableScheduleSlots: [
          { dayOfWeek: 1, startHour: '08:00', endHour: '17:00' },
          { dayOfWeek: 2, startHour: '08:00', endHour: '17:00' },
        ],
      }),
      [ProductType.SURPLUS_STOCK]: (): SurplusProduct => ({
        ...baseProduct,
        type: ProductType.SURPLUS_STOCK,
        requiresShipping: true,
        exactStockLevel: 1,
        isLotSale: true,
        geolocation: {
          latitude: Number(custom['originLatitude'] || -23.5505),
          longitude: Number(custom['originLongitude'] || -46.6333),
          originCity: String(custom['originCity'] || 'São Paulo'),
          originState: String(custom['originState'] || 'SP'),
          maxShippingRadiusKm: Number(custom['maxShippingRadiusKm'] || 50),
        },
      }),
      [ProductType.RENTAL]: (): RentalProduct => ({
        ...baseProduct,
        type: ProductType.RENTAL,
        requiresShipping: true,
        inventoryCount: 5,
        rentalSpecification: {
          dailyRate: Number(custom['dailyRate'] || baseProduct.basePrice),
          minRentalDays: Number(custom['minRentalDays'] || 1),
          maxRentalDays: Number(custom['maxRentalDays'] || 30),
          securityDepositAmount: Number(custom['securityDepositAmount'] || 0),
          blockedPeriods: [],
        },
      }),
    };

    const strategy = mapperStrategy[domainType] || mapperStrategy[ProductType.PHYSICAL];
    return strategy();
  }
}
