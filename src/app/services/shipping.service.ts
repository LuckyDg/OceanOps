import { catchError, map, Observable, of } from 'rxjs';
import { Container, Vessel } from '@models/buques.model';
import { environment } from '@environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // Obtener la lista de buques desde el archivo JSON
  getVessels(): Observable<Vessel[]> {
    return this.http.get<{ vessels: Vessel[] }>(this.apiUrl).pipe(
      map(response => {
        return response.vessels;
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  getContainerDetails(containerId: string): Observable<Container | null> {
    return this.http.get<{ vessels: Vessel[] }>(this.apiUrl).pipe(
      map(response => {
        for (const vessel of response.vessels) {
          const foundContainer = vessel.containers.find(
            container => container.id === containerId
          );
          if (foundContainer) {
            return foundContainer;
          }
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching container details:', error);
        return of(null);
      })
    );
  }
}
