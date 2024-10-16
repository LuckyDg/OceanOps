# Example Generate Json Fake Data

### Interfaces

```ts
export interface Container {
  id: string;
  name: string;
  type: string;
  weight: string;
  dimensions: string;
  status: string;
  loadingDate: string;
  user: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  ship: {
    name: string;
    code: string;
  };
  statusHistory: {
    description: string;
    date: string;
  }[];
}

export interface Vessel {
  id: string;
  name: string;
  type: string;
  imo: string;
  length: number;
  width: number;
  draft: number;
  yearBuilt: number;
  capacity: {
    container: number;
    weight: number;
  };
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  status: string;
  voyages: any[];
  containers: Container[];
}
```

### Service Generator

```ts
import { saveAs } from "file-saver";
export class ShippingService {
  private vessels: Vessel[] = [];
  private containers: Container[] = [];

  constructor(private readonly http: HttpClient) {
    this.generateVesselsWithContainers(15); // Generar 15 ítems
  }

  private generateVesselsWithContainers(count: number): void {
    for (let i = 0; i < count; i++) {
      const vesselId = this.generateUUID();
      const containerCount = Math.floor(Math.random() * 5) + 1; // Generar entre 1 y 5 contenedores

      const vessel: Vessel = {
        id: vesselId,
        name: `Vessel ${i + 1}`,
        type: "Cargo Ship",
        imo: this.generateUUID(),
        length: 200 + Math.random() * 20,
        width: 32 + Math.random() * 10,
        draft: 10 + Math.random() * 2,
        yearBuilt: 2010 + Math.floor(Math.random() * 10),
        capacity: {
          container: 1500 + Math.floor(Math.random() * 300),
          weight: 50000 + Math.floor(Math.random() * 10000),
        },
        currentLocation: {
          latitude: 35 + Math.random() * 5,
          longitude: -120 + Math.random() * 5,
        },
        status: i % 2 === 0 ? "In Port" : "In Transit",
        voyages: [],
        containers: this.generateContainers(containerCount, vesselId), // Generar contenedores
      };

      this.vessels.push(vessel);
    }

    this.saveDataToFile(this.vessels);
  }

  private generateContainers(count: number, vesselId: string): Container[] {
    const containers: Container[] = [];

    for (let i = 0; i < count; i++) {
      const container: Container = {
        id: `C${String(i + 1).padStart(3, "0")}`,
        name: "Contenedor",
        type: this.getRandomContainerType(),
        weight: `${Math.floor(Math.random() * 5000) + 1000} kg`,
        dimensions: "2x2x6",
        status: i % 2 === 0 ? "En tránsito" : "En puerto",
        loadingDate: new Date().toISOString().split("T")[0],
        user: {
          name: `User ${i + 1}`,
          phone: `+1 234 567 ${Math.floor(Math.random() * 900) + 100}`,
          email: `user${i + 1}@example.com`,
          address: `Address ${i + 1}`,
        },
        ship: {
          name: `Vessel ${vesselId}`,
          code: vesselId,
        },
        statusHistory: [
          {
            description: this.getRandomContainerStatus(),
            date: new Date().toISOString().split("T")[0],
          },
        ],
      };

      containers.push(container);
    }

    return containers;
  }

  private getRandomContainerType(): string {
    const types = ["Electrónicos", "Frutas", "Ropa", "Muebles"];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomContainerStatus(): string {
    const statuses = ["En tránsito", "En puerto", "Entregado", "Almacenado"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private saveDataToFile(data: Vessel[]): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, "vessels_with_containers.json");
  }

  getVessels(): Observable<Vessel[]> {
    return of(this.vessels);
  }
}
```
