export interface Order {
  customer_id: string;
  name: string;
  phone: string;
  email: string;
  // loading_date: string;
  // starting_date: string;
  // loading_point: string;
  // unloading_point: string;
  orientation: string;
  number_of_consignment:string;
  length: any;
  truck_type?: TruckType[];
  status:string;
  order_id:string;
  pk:string;
  sk:string;
  comment?:string;
  created_at?:string;
  created_date?:string;
  customer_type?:string;
  fileName?:string;
  updated_by?:string;
  previous_status?:string;
  order_date? : string;
  
}

export interface Product{
  porductName: string;
  remarks: string;
  pk: string;
  sk: string;
  created_date? : string;
}
export interface TruckType {
  weight: string;
  quantity: number;
  type: string;
  length:string;
  cbm?:string;
}
