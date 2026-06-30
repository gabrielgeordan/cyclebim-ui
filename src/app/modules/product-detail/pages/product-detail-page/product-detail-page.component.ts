// src/app/modules/product-detail/pages/product-detail-page/product-detail-page.component.ts

import { Component, Input, inject, signal } from '@angular/core';
import {
  Product,
  ProductType,
  ServiceScheduleSlot,
  isRentalProduct,
  isSurplusProduct,
} from '../../../catalog/data-access/models';
import { CartFacade } from '../../../core/facades/cart.facade';
import {
  RentalCalendarComponent,
  RentalSelectionPayload,
} from '../../components/rental-calendar/rental-calendar.component';
import { ServiceSchedulerComponent } from '../../components/service-scheduler/service-scheduler.component';
import { SurplusGeoValidatorComponent } from '../../components/surplus-geo-validator/surplus-geo-validator.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    RentalCalendarComponent,
    ServiceSchedulerComponent,
    SurplusGeoValidatorComponent,
  ],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent {
  @Input({ required: true }) product!: Product;

  readonly cartFacade = inject(CartFacade);
  readonly productTypeEnum = ProductType;

  readonly rentalSelection = signal<RentalSelectionPayload | null>(null);
  readonly selectedServiceSlot = signal<ServiceScheduleSlot | null>(null);
  readonly isSurplusShippingViable = signal<boolean>(true);

  onRentalSelect(payload: RentalSelectionPayload): void {
    this.rentalSelection.set(payload);
  }

  onServiceSlotSelect(slot: ServiceScheduleSlot): void {
    this.selectedServiceSlot.set(slot);
  }

  onGeoValidationChange(isViable: boolean): void {
    this.isSurplusShippingViable.set(isViable);
  }

  addToCart(): void {
    const rental = this.rentalSelection();
    const service = this.selectedServiceSlot();

    this.cartFacade.addItem({
      productVariantId: `${this.product.id}-variant-1`,
      quantity: 1,
      rentalStartDate: rental?.startDate,
      rentalEndDate: rental?.endDate,
      rentalDaysCount: rental?.daysCount,
      scheduledServiceSlotDay: service?.dayOfWeek,
      scheduledServiceSlotTime: service
        ? `${service.startHour}-${service.endHour}`
        : undefined,
    });
  }

  asRentalProduct() {
    return isRentalProduct(this.product) ? this.product : null;
  }

  asSurplusProduct() {
    return isSurplusProduct(this.product) ? this.product : null;
  }
}
