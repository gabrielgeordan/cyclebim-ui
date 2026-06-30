// src/app/modules/product-detail/components/surplus-geo-validator/surplus-geo-validator.component.ts

import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { GeolocationConstraint } from '../../../catalog/data-access/models';

@Component({
  selector: 'app-surplus-geo-validator',
  standalone: true,
  templateUrl: './surplus-geo-validator.component.html',
  styleUrl: './surplus-geo-validator.component.scss',
})
export class SurplusGeoValidatorComponent {
  @Input({ required: true }) constraint!: GeolocationConstraint;
  @Output() readonly validationChange = new EventEmitter<boolean>();

  private readonly _userLat = signal<number | null>(null);
  private readonly _userLon = signal<number | null>(null);

  readonly userLat = computed(() => this._userLat());
  readonly userLon = computed(() => this._userLon());

  readonly calculatedDistanceKm = computed(() => {
    const lat = this._userLat();
    const lon = this._userLon();
    if (lat === null || lon === null) return null;
    return this.calculateHaversineDistance(
      this.constraint.latitude,
      this.constraint.longitude,
      lat,
      lon
    );
  });

  readonly isViable = computed(() => {
    const dist = this.calculatedDistanceKm();
    if (dist === null) return false;
    return dist <= this.constraint.maxShippingRadiusKm;
  });

  simulateGeolocation(lat: number, lon: number): void {
    this._userLat.set(lat);
    this._userLon.set(lon);
    this.validationChange.emit(this.isViable());
  }

  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
}
