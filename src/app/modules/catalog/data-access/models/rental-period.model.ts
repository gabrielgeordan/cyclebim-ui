// src/app/modules/catalog/data-access/models/rental-period.model.ts

export interface DateRange {
  readonly startDate: string;
  readonly endDate: string;
}

export interface RentalPeriodSpecification {
  readonly dailyRate: number;
  readonly minRentalDays: number;
  readonly maxRentalDays: number;
  readonly securityDepositAmount?: number;
  readonly blockedPeriods: readonly DateRange[];
}
