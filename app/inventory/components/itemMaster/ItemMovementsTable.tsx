"use client";

import { Table, Tag } from "antd";
import { format } from "date-fns";
import type { ColumnsType } from "antd/es/table";
import { ActivityType } from "../../enums/activityType";
import { IMovement } from "../../types/movement";

interface ItemMovementsTableProps {
  movements: IMovement[];
}

const ItemMovementsTable = ({ movements }: ItemMovementsTableProps) => {
  const columns: ColumnsType<IMovement> = [
    {
      title: "Activity",
      dataIndex: "activity_type",
      key: "activity_type",
      filters: [
        { text: "Inbound", value: "inbound" },
        { text: "Outbound", value: "outbound" },
      ],
      onFilter: (value, record: IMovement) => record.activity_type === value,
      render: (activityType: ActivityType, record: IMovement) => {
        return (
          <div>
            <Tag
              color={activityType === ActivityType.INBOUND ? "green" : "red"}
            >
              {activityType === ActivityType.INBOUND ? "Inbound" : "Outbound"}
            </Tag>
            {record.note && (
              <p className="text-sm text-gray-500 mt-1">Note: {record.note}</p>
            )}
          </div>
        );
      },
    },
    {
      title: "Create At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: IMovement, b: IMovement) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date: string) => format(new Date(date), "MMM d, yyyy h:mm a"),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      sorter: (a: IMovement, b: IMovement) => a.qty - b.qty,
      render: (qty: number, record: IMovement) => (
        <span
          className={`${
            record.activity_type === ActivityType.INBOUND
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {record.activity_type === ActivityType.INBOUND ? "+" : "-"}
          {qty.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={movements}
      rowKey={(record) => record.id}
      pagination={false}
      size="middle"
      scroll={{ x: "max-content", y: 250 }}
    />
  );
};

export default ItemMovementsTable;
