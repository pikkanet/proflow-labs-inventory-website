export interface ICreateItemMasterRequest {
  name: string;
  image: string;
  warehouse_id: number;
}

export interface ICreateItemMasterResponse {
  message: string;
  statusCode?: number;
}
