import { Injectable } from '@angular/core';
import { Vessel } from '../models/vessel.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private readonly vessels: Vessel[] = [
    {
      id: "vessel_001",
      name: "Sea Explorer",
      type: "Cargo Ship",
      imo: "1234567",
      length: 200,
      width: 32,
      draft: 10,
      yearBuilt: 2015,
      capacity: {
        container: 1500,
        weight: 50000
      },
      currentLocation: {
        latitude: 35.6895,
        longitude: 139.6917
      },
      status: "active",
      voyages: [
        {
          voyageId: "voyage_001",
          departurePort: "Los Angeles",
          arrivalPort: "Tokyo",
          departureDate: "2024-10-01",
          arrivalDate: "2024-10-15",
          cargo: [
            {
              description: "Electronics",
              weight: 20000,
              quantity: 100
            },
            {
              description: "Furniture",
              weight: 15000,
              quantity: 50
            }
          ],
          captain: {
            name: "John Doe",
            licenseNumber: "C123456",
            experienceYears: 10
          }
        }
      ]
    },
  ];

  constructor() {
    // Generar datos adicionales
    this.generateAdditionalVessels(10);
  }

  // Método para generar datos adicionales
  private generateAdditionalVessels(count: number): void {
    for (let i = 0; i < count; i++) {
      this.vessels.push({
        id: this.generateUUID(),
        name: `Vessel ${i + 1}`,
        type: "Bulk Carrier",
        imo: this.generateUUID(), // Usar UUID para IMO también
        length: 180 + Math.random() * 20, // Longitud aleatoria
        width: 30 + Math.random() * 10, // Anchura aleatoria
        draft: 8 + Math.random() * 2, // Calado aleatorio
        yearBuilt: 2010 + Math.floor(Math.random() * 10), // Año de construcción aleatorio
        capacity: {
          container: 1200 + Math.floor(Math.random() * 300), // Capacidad aleatoria
          weight: 20000 + Math.floor(Math.random() * 5000) // Peso aleatorio
        },
        currentLocation: {
          latitude: 32 + Math.random(),
          longitude: -117 + Math.random()
        },
        status: i % 2 === 0 ? "In Port" : "In Transit",
        voyages: []
      });
    }
  }

  // Método para obtener el UUID
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Método para obtener los buques
  getVessels(): Observable<Vessel[]> {
    return of(this.vessels);
  }
}
