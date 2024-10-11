import { Injectable } from '@angular/core';
import { Vessel } from '../models/vessel.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  private readonly vessels: Vessel[] = [
    {
      id: "2b6e2c34-4f51-4d71-8c55-44b354053def",
      name: "Explorador del Mar",
      type: "Buque Portacontenedores",
      capacity: 10000,
      current_location: { latitude: 34.0522, longitude: -118.2437 },
      status: "En Tránsito",
      containers: [
        {
          id: "c2f9e1bc-b5d6-4c7b-87d4-9c3f62f57f4c",
          container_number: "CNSU1234567",
          content: "Electrónica",
          weight: 2000,
          destination_port: "Los Ángeles"
        },
        {
          id: "a9c3940e-3f3d-44c3-8c42-09338c5b67b9",
          container_number: "MSC1234568",
          content: "Ropa",
          weight: 1500,
          destination_port: "Los Ángeles"
        }
      ]
    },

  ];

  constructor() {
    // Simular datos adicionales para completar los 10 ítems
    this.generateAdditionalVessels(10);
  }

  // Método para generar datos adicionales
  private generateAdditionalVessels(count: number): void {
    for (let i = 0; i < count; i++) {
      this.vessels.push({
        id: this.generateUUID(),
        name: `Vessel ${i + 1}`,
        type: "Buque Granelero",
        capacity: 12000,
        current_location: { latitude: 32 + Math.random(), longitude: -117 + Math.random() },
        status: i % 2 === 0 ? "En Puerto" : "En Tránsito",
        containers: [
          {
            id: this.generateUUID(),
            container_number: `CONTAINER${i + 1}`,
            content: "Granos",
            weight: Math.floor(Math.random() * 5000),
            destination_port: "Puerto"
          }
        ]
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
