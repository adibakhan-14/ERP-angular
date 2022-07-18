export interface Customer {
  customer_id?: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  password?:string;
  orientation:string;
  created_at?: string;
  pk?: string;
  gk?: string;
  picture_name?: string;
  userPicture?: string;
  //pictureUrl?: string;
}
