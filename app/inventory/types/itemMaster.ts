import { StockStatus } from "../enums/stockStatus";

export interface IItemMaster {
  sku: string;
  name: string;
  warehouse: string;
  qty: number;
  reserve_qty: number;
  stock_status: StockStatus;
  updated_at: string;
  is_show: boolean;
  image: string;
  warehouse_id: number;
}

export interface IItemMasterResponse {
  data: IItemMaster[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  message?: string;
}
