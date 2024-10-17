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
