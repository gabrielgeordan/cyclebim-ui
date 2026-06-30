// src/app/modules/checkout/pages/checkout-page/checkout-page.component.ts

import { Component, inject } from '@angular/core';
import { ProductType } from '../../../catalog/data-access/models';
import { CartFacade } from '../../../core/facades/cart.facade';
import { CartLineItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  readonly cartFacade = inject(CartFacade);

  getLineTypeDescription(line: CartLineItem): string {
    const strategy: Record<ProductType, () => string> = {
      [ProductType.RENTAL]: () =>
        `Locação por ${line.rentalDaysCount || 1} dias (${line.rentalStartDate} até ${line.rentalEndDate})`,
      [ProductType.SERVICE]: () =>
        `Serviço agendado: Dia ${line.scheduledServiceSlotDay} (${line.scheduledServiceSlotTime}) - Sem frete`,
      [ProductType.SURPLUS_STOCK]: () =>
        'Lote de Sobras de Obra (Verificação logística confirmada)',
      [ProductType.PHYSICAL]: () => 'Material físico - Entrega padrão logístico',
    };

    const resolver = strategy[line.productDomainType] || strategy[ProductType.PHYSICAL];
    return resolver();
  }

  submitOrder(): void {
    alert('Pedido da Versão Beta submetido com sucesso para o Vendure E-Commerce!');
  }
}
