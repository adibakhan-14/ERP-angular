export interface Driver {
    driver_id?: string;
    driver_name: string;
    license_number: string;
    nid_number: string;
    validity: string;
    number:string;
    address:string;
    created_at?: string;
    pk: string;
    sk: string;
    status?: string;
    // driver_status ?: string;
    previous_status? :string;
  }