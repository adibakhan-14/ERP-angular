export interface Truck {
  truck_reg: string;
 // device_id: string;
  pk: any;
  sk: any;
  status:string;
  length: any;
  weight: any;
  type: string;
  is_available?: boolean;
  truck_loading_date: string;
  truck_starting_date: string;
  truck_loading_point: string;
  truck_unloading_point: string;
  truck_fare?:string;
  truck_id?: string;
  metro?: string;
  serial? : string;
  number?: number

}
export interface TruckList {
  cbm?:string;
  length: string;
  created_at?: Date;
  created_date?:string;
  device_id?: string;
  orientation: string;
  phone?: string;
  updated_by?:string;
  previous_status?:string;
  prev_rent_status?:string;
  pk: string;
  sk: string;
  status: string;
  truck_id: string;
  truck_reg: string;
  type: string;
  vendor_id: string;
  vendor_name: string;
  weight:string;
  checked?: boolean;
  quantity? :number;
  trip_id? :string;
  round_trip?:string;
}

export interface TruckEdit {
  cbm?:string;
  created_at?: string;
  created_date?: string;
  device_id?: string;
  length: string;
  orientation: string
  phone?: string
  pk: string
  sk: string
  status: string
  truck_id: string
  truck_reg: string
  type: string
  vendor_id: string
  vendor_name: string
  weight: string
}
export interface OrderedTruck{
  // truck_reg: string;
  // vendor_name: string;
  // vendor_phn?: string;
  cbm?:string;
  driver_name?:string;
  truck_fare?: string;
  device_id?: string;
  email: string;
  status:string;
  quantity?:number;
  length: string;
  weight :any;
  type: string;
  is_available?: boolean;
  truck_loading_date: string;
  truck_starting_date: string;
  truck_loading_point: string;
  truck_unloading_point: string;
}
