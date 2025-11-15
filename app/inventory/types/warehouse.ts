export interface IWarehouse {
  id: number;
  name: string;
  created_at: string;
}

export interface IWarehouseResponse {
  data: IWarehouse[];
  message?: string;
}
