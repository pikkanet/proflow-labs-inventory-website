"use client";

import { Table, Image, Button, Space, Tooltip, Badge } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { useState } from "react";

interface Item {
  sku: string;
  name: string;
  warehouse: string;
  qty: number;
  reserve_qty: number;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  updated_at: string;
  is_show: boolean;
  image: string;
}

interface Movement {
  activity: "inbound" | "outbound";
  qty: number;
  current_qty: number;
  create_at: string;
  note: string | null;
}

interface MovementsData {
  sku: string;
  name: string;
  movements: Movement[];
}

interface TableItemsProps {
  items: Item[];
  loading?: boolean;
}

const TableItems = ({ items, loading = false }: TableItemsProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleExpand = (expanded: boolean, record: Item) => {
    console.log("expanded", expanded, record);

  const getStockStatusConfig = (status: string) => {
    const configs = {
      in_stock: { status: "success" as const, label: "In Stock" },
      low_stock: { status: "warning" as const, label: "Low Stock" },
      out_of_stock: { status: "error" as const, label: "Out of Stock" },
    };
    return configs[status as keyof typeof configs] || configs.in_stock;
  };

  const renderColumns: ColumnsType<Item> = [
    {
      title: "Item Master",
      key: "item_master",
      width: 300,
      fixed: "left",
      sorter: (a: Item, b: Item) => a.name.localeCompare(b.name),
      render: (_, record: Item) => (
        <div className="flex items-center gap-3 min-w-[250px]">
          <div className="w-[60px] h-[60px] flex-shrink-0">
            <Image
              src={record.image}
              alt={record.name}
              width={60}
              height={60}
              className="object-cover rounded"
              preview={false}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
              <Tooltip title={record.name}>{record.name}</Tooltip>
            </div>
            <Tooltip title={record.sku}>
              <p className="w-full text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis inline-block">
                SKU: {record.sku}
              </p>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: "Warehouse",
      dataIndex: "warehouse",
      key: "warehouse",
      width: 200,
      sorter: (a: Item, b: Item) => a.warehouse.localeCompare(b.warehouse),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      width: 100,
      align: "center",
      sorter: (a: Item, b: Item) => a.qty - b.qty,
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: "Reserve QTY",
      dataIndex: "reserve_qty",
      key: "reserve_qty",
      width: 120,
      align: "center",
      sorter: (a: Item, b: Item) => a.reserve_qty - b.reserve_qty,
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: "Stock Status",
      dataIndex: "stock_status",
      key: "stock_status",
      width: 160,
      filters: [
        { text: "In Stock", value: "in_stock" },
        { text: "Low Stock", value: "low_stock" },
        { text: "Out of Stock", value: "out_of_stock" },
      ],
      onFilter: (value, record: Item) => record.stock_status === value,
      render: (status: string) => {
        const config = getStockStatusConfig(status);
        return <Badge status={config.status} text={config.label} />;
      },
    },
    {
      title: "Update Date",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 200,
      sorter: (a: Item, b: Item) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      render: (date: string) => format(new Date(date), "MMM d, yyyy h:mm a"),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record: Item) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              disabled
              icon={<EditOutlined className="text-lg" />}
              onClick={() => console.log("Edit", record.sku)}
            />
          </Tooltip>
          <Tooltip
            title={
              record.is_show
                ? "Hide this item from display"
                : "Show this item on the page"
            }
          >
            <Button
              type="text"
              icon={
                record.is_show ? (
                  <EyeOutlined className="text-lg" />
                ) : (
                  <EyeInvisibleOutlined className="text-lg" />
                )
              }
              onClick={() => console.log("Toggle visibility", record.sku)}
              disabled
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  const expandedRowRender = (record: Item) => {
    return null;
  };
  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        <Table
          columns={renderColumns}
          dataSource={items}
          rowKey="sku"
          loading={loading}
          expandable={{
            expandedRowRender,
            onExpand: handleExpand,
            expandRowByClick: false,
          }}
          pagination={false}
          scroll={{ y: "calc(100vh - 450px)" }}
          className="flex-1"
          rowClassName={(record) => {
            const isExpanded = expandedRows.has(record.sku);
            return isExpanded ? "ant-table-row-hover" : "";
          }}
        />
      </div>
    </>
  );
};

export default TableItems;
