// src/app/modules/catalog/pages/catalog-page/catalog-page.component.ts

import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CatalogFacade } from '../../data-access/facades/catalog.facade';
import { Product, ProductType } from '../../data-access/models';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
})
export class CatalogPageComponent {
  readonly facade = inject(CatalogFacade);
  readonly productTypeEnum = ProductType;

  onSelectProduct(product: Product): void {
    console.log('Produto selecionado no beta:', product.id);
  }

  filterByType(type: ProductType | null): void {
    this.facade.setFilter(type);
  }
}
