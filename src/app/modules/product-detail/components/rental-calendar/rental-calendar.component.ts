// src/app/modules/product-detail/components/rental-calendar/rental-calendar.component.ts

import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { RentalPeriodSpecification } from '../../../catalog/data-access/models';

export interface RentalSelectionPayload {
  readonly startDate: string;
  readonly endDate: string;
  readonly daysCount: number;
}

@Component({
  selector: 'app-rental-calendar',
  standalone: true,
  templateUrl: './rental-calendar.component.html',
  styleUrl: './rental-calendar.component.scss',
})
export class RentalCalendarComponent {
  @Input({ required: true }) specification!: RentalPeriodSpecification;
  @Output() readonly selectionChange = new EventEmitter<RentalSelectionPayload>();

  private readonly _startDate = signal<string>('');
  private readonly _endDate = signal<string>('');

  readonly startDate = computed(() => this._startDate());
  readonly endDate = computed(() => this._endDate());

  readonly daysCount = computed(() => {
    const start = this._startDate();
    const end = this._endDate();
    if (!start || !end) return 0;
    const diffTime = new Date(end).getTime() - new Date(start).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  });

  readonly estimatedTotal = computed(() => {
    const days = this.daysCount();
    const deposit = this.specification?.securityDepositAmount || 0;
    if (days < (this.specification?.minRentalDays || 1)) return 0;
    return days * (this.specification?.dailyRate || 0) + deposit;
  });

  readonly isValid = computed(() => {
    const days = this.daysCount();
    return (
      days >= (this.specification?.minRentalDays || 1) &&
      days <= (this.specification?.maxRentalDays || 365)
    );
  });

  onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._startDate.set(input.value);
    this.emitSelection();
  }

  onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this._endDate.set(input.value);
    this.emitSelection();
  }

  private emitSelection(): void {
    if (this.isValid()) {
      this.selectionChange.emit({
        startDate: this._startDate(),
        endDate: this._endDate(),
        daysCount: this.daysCount(),
      });
    }
  }
}
