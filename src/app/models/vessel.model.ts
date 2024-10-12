export interface Cargo {
    description: string;
    weight: number;
    quantity: number;
}

export interface Captain {
    name: string;
    licenseNumber: string;
    experienceYears: number;
}

export interface Voyage {
    voyageId: string;
    departurePort: string;
    arrivalPort: string;
    departureDate: string;
    arrivalDate: string;
    cargo: Cargo[];
    captain: Captain;
}

export interface CurrentLocation {
    latitude: number;
    longitude: number;
}

export interface Capacity {
    container: number;
    weight: number;
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
    capacity: Capacity;
    currentLocation: CurrentLocation;
    status: string;
    voyages: Voyage[];
}