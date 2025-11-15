export interface IDashboard {
  totalItems: number;
  totalQuantity: number;
  lowStock: number;
  outOfStock: number;
  lastUpdated: string;
}

export interface IDashboardResponse {
  message?: string;
  data: IDashboard;
}
