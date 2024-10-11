export interface Location {
    latitude: number;
    longitude: number;
}

export interface Container {
    id: string;
    container_number: string;
    content: string;
    weight: number;
    destination_port: string;
}

export interface Vessel {
    id: string;
    name: string;
    type: string;
    capacity: number;
    current_location: Location;
    status: string;
    containers: Container[];
}
