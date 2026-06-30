// src/app/modules/core/services/vendure-graphql.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface GraphqlResponse<T> {
  readonly data: T;
  readonly errors?: readonly { readonly message: string }[];
}

@Injectable({ providedIn: 'root' })
export class VendureGraphqlService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/shop-api';

  query<T, V = Record<string, unknown>>(
    query: string,
    variables?: V
  ): Observable<T> {
    return this.http
      .post<GraphqlResponse<T>>(
        this.apiUrl,
        { query, variables },
        { withCredentials: true }
      )
      .pipe(
        map(response => {
          if (response.errors && response.errors.length > 0) {
            throw new Error(response.errors[0].message);
          }
          return response.data;
        })
      );
  }
}
