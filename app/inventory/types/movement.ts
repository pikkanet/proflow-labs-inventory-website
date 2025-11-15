import { ActivityType } from "../enums/activityType";

export interface IMovement {
  id: number;
  item_master_id: number;
  activity_type: ActivityType;
  qty: number;
  current_qty: number;
  created_at: string;
  note: string;
}

export interface IMovementResponse {
  data: IMovement[];
  message?: string;
}
