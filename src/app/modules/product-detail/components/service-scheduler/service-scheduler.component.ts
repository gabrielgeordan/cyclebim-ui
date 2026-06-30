// src/app/modules/product-detail/components/service-scheduler/service-scheduler.component.ts

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ServiceScheduleSlot } from '../../../catalog/data-access/models';

@Component({
  selector: 'app-service-scheduler',
  standalone: true,
  templateUrl: './service-scheduler.component.html',
  styleUrl: './service-scheduler.component.scss',
})
export class ServiceSchedulerComponent {
  @Input({ required: true }) slots!: readonly ServiceScheduleSlot[];
  @Output() readonly slotSelect = new EventEmitter<ServiceScheduleSlot>();

  readonly selectedSlotIndex = signal<number | null>(null);

  selectSlot(slot: ServiceScheduleSlot, index: number): void {
    this.selectedSlotIndex.set(index);
    this.slotSelect.emit(slot);
  }

  getDayName(dayOfWeek: number): string {
    const days: Record<number, string> = {
      0: 'Domingo',
      1: 'Segunda-feira',
      2: 'Terça-feira',
      3: 'Quarta-feira',
      4: 'Quinta-feira',
      5: 'Sexta-feira',
      6: 'Sábado',
    };
    return days[dayOfWeek] || 'Dia Comercial';
  }
}
