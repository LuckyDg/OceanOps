// User types
export type UserRole = 'admin' | 'operator' | 'auditor' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  permissions: string[];
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

// Ship types
export type ShipType = 'cargo' | 'container' | 'tanker' | 'bulk_carrier' | 'roll_on_roll_off';
export type ShipStatus = 'in_port' | 'in_transit' | 'maintenance' | 'out_of_service';

export interface Ship {
  id: string;
  name: string;
  imo_number: string;
  call_sign: string;
  type: ShipType;
  status: ShipStatus;
  length: number;
  width: number;
  draft: number;
  gross_tonnage: number;
  deadweight_tonnage: number;
  max_containers: number;
  current_port_id?: string;
  next_port_id?: string;
  estimated_arrival?: string;
  estimated_departure?: string;
  is_active: boolean;
  created_at: string;
}

// Container types
export type ContainerType = 'dry' | 'refrigerated' | 'tank' | 'flat_rack' | 'open_top' | 'high_cube';
export type ContainerSize = '20ft' | '40ft' | '45ft';
export type ContainerStatus = 'empty' | 'loaded' | 'in_transit' | 'in_port' | 'delivered' | 'damaged';

export interface Container {
  id: string;
  container_number: string;
  type: ContainerType;
  size: ContainerSize;
  status: ContainerStatus;
  weight: number;
  max_weight: number;
  temperature?: number;
  description?: string;
  current_port_id?: string;
  destination_port_id?: string;
  ship_id?: string;
  is_active: boolean;
}

// Cargo types
export type CargoType =
  | 'general'
  | 'hazardous'
  | 'refrigerated'
  | 'liquid'
  | 'solid'
  | 'machinery'
  | 'vehicles'
  | 'food'
  | 'chemicals'
  | 'textiles';

export type CargoStatus = 'pending' | 'loaded' | 'in_transit' | 'delivered' | 'damaged' | 'lost';
export type HazardLevel = 'none' | 'low' | 'medium' | 'high' | 'extreme';

export interface Cargo {
  id: string;
  description: string;
  type: CargoType;
  status: CargoStatus;
  weight: number;
  volume: number;
  value: number;
  origin: string;
  destination: string;
  hazard_level: HazardLevel;
  hazard_description?: string;
  is_illegal: boolean;
  illegal_reason?: string;
  loading_date?: string;
  expected_delivery?: string;
  tracking_number: string;
  shipper_name: string;
  consignee_name: string;
  container_id?: string;
}

// Port types
export type PortType = 'commercial' | 'industrial' | 'fishing' | 'military' | 'cruise' | 'mixed';
export type PortSize = 'small' | 'medium' | 'large' | 'mega';

export interface Port {
  id: string;
  name: string;
  code: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  type: PortType;
  size: PortSize;
  max_ships: number;
  max_containers: number;
  max_draft: number;
  is_active: boolean;
  is_operational: boolean;
  last_inspection?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Reports
export interface TrafficReportParams {
  origin_port_id?: string;
  destination_port_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface TrafficReportData {
  port: string;
  shipments: number;
  volume: number;
  period: string;
}

export interface IllegalCargoReportParams {
  start_date?: string;
  end_date?: string;
}

export interface IllegalCargoItem {
  id: string;
  tracking_number: string;
  description: string;
  illegal_reason: string;
  shipper_name: string;
  origin: string;
  destination: string;
  detected_at: string;
}

// Query params
export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ShipListParams extends ListParams {
  status?: ShipStatus;
  type?: ShipType;
}

export interface ContainerListParams extends ListParams {
  status?: ContainerStatus;
  type?: ContainerType;
}

export interface CargoListParams extends ListParams {
  status?: CargoStatus;
  type?: CargoType;
  is_illegal?: boolean;
}

export interface PortListParams extends ListParams {
  country?: string;
  type?: PortType;
}
