import { StringifyOptions } from "querystring";

export interface OrdersBoardItem {
  count: number;
  customer_id: string;
  trip_number: string;
  name: string;
  customer_type?:string;
  phone?: string;
  email?: string;
  image_path?: string;
  fileName?:string;
  status: string;
  vendor_name:string,
  driver_name: string,
  driver_phone: string,
  truck_reg: string,
  vendor_phone: string,
  order_date?: string;
  expected_delivery_date?: string;
  loading_date?: string;
  starting_date?: string;
  loading_point?: string;
  unloading_point?: string;
  previous_status?: string;
  orientation:string;
  number_of_consignment: string;
  truck_details?: TruckDetails[];
  destination?: Destination[];
  order_id?: string;
  pk?:string;
  sk?:string;
  created_at?:string;
  created_date?:string;
  url?: string;
  updated_by?:string;
  bidding_time?:string;
  bidding_date?:string;
  Confirm:string
}
export interface TruckType {
  name: string;
  length: string;
  weight: string;
  cbm: string;
}
export interface MovingItem {
  item: OrdersBoardItem;
  title?: string;
}
export interface TruckDetails{
bidding_date: string;
bidding_time: string;
destination: Destination[];
fare: string;
order_id: string;
status: string;
trip_id:string;
trip_number:string;
truck_reg: string;
truck_type: TruckType[]
type:string;

}

export interface Destination{
load_district: string;
loading_date: string;
loading_person: string;
loading_person_no: string;
loading_point: string;
loading_time: string;

unload_district: string;
unloading_date: string;
unloading_person: string;
unloading_person_no: string;
unloading_point: string;
unloading_time: string;

product_material: string;
product_name: string;
product_quantity: string;
product_weight: string;
}
