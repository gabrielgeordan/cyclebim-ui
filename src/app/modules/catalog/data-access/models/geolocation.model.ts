// src/app/modules/catalog/data-access/models/geolocation.model.ts

export interface GeolocationCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface GeolocationConstraint extends GeolocationCoordinates {
  readonly originCity: string;
  readonly originState: string;
  readonly maxShippingRadiusKm: number;
}
