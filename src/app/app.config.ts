import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/catalog/pages/catalog-page/catalog-page.component').then(
        m => m.CatalogPageComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./modules/checkout/pages/checkout-page/checkout-page.component').then(
        m => m.CheckoutPageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};
