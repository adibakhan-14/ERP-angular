export interface TruckBoardItem {
    cbm?:string;
    checked?: boolean;
    created_at?: Date;
    created_date?:string;
    length?: string;
    order_id? :string;
    orientation: string;
    phone?:string;
    pk: string;
    previous_status?:string;
    prev_rent_status?:string;
    sk: string;
    status: string;
    truck_id: string;
    truck_reg: string;
    type: string;
    updated_by?:string;
    vendor_id: string;
    vendor_name: string;
    weight:string;
    trip_id? :string;
   loading_point?:string;
  unloading_point?: string;
  rent_time?:string;
  round_trip?:string;
  truck_loading_point?:string;
  loading_phone?:string;
  truck_unloading_point?:string;
  unloading_phone?:string;
  truck_starting_date?:string,
  truck_loading_date?:string,
  product_and_destination?:any

    ///////////
  //  device_id?: string;
  }

  export interface MovingTruckItem {
    item?: any;
    title?: string;

  }
  export interface truckStatusItems {
   pending: TruckBoardItem[];
   loadCompleted:TruckBoardItem[];
   inTransit:TruckBoardItem[];
   unloadComplete:TruckBoardItem[];
  }
