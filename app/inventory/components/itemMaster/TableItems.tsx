"use client";

import { Table, Image, Button, Space, Tooltip, Badge, Divider } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { useState } from "react";
import ItemMovementsTable from "./ItemMovementsTable";
import axiosInstance from "@/app/services/axiosInstance";
import Swal from "sweetalert2";
import AddMovementModal from "../modals/AddMovementModal";
import ItemMovementChart from "./ItemMovementChart";
import EditInventoryModal from "../modals/EditInventoryModal";
import { IItemMaster } from "../../types/itemMaster";
import { StockStatus } from "../../enums/stockStatus";
import { IMovement, IMovementResponse } from "../../types/movement";

interface TableItemsProps {
  items: IItemMaster[];
  loading?: boolean;
  onFetchItems?: () => void;
}

const TableItems = ({
  items,
  loading = false,
  onFetchItems,
}: TableItemsProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [movementsData, setMovementsData] = useState<
    Record<string, IMovement[]>
  >({});
  const [loadingMovements, setLoadingMovements] = useState<
    Record<string, boolean>
  >({});
  const [addMovementModalOpen, setAddMovementModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItemMaster | null>(null);

  const [editInventoryModalOpen, setEditInventoryModalOpen] = useState(false);

  const fetchMovements = async (sku: string, forceRefresh: boolean = false) => {
    if (movementsData[sku] && !forceRefresh) return;

    setLoadingMovements((prev) => ({ ...prev, [sku]: true }));
    try {
      const response = await axiosInstance.get<IMovementResponse>(
        `/item/${sku}/movements`
      );
      const { data, status } = response;
      if (status !== 200) {
        throw new Error(data.message);
      }
      const movements = data.data;
      setMovementsData((prev) => ({ ...prev, [sku]: movements }));
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please try again later",
        confirmButtonColor: "#326A8C",
      });
    } finally {
      setLoadingMovements((prev) => ({ ...prev, [sku]: false }));
    }
  };

  const handleExpand = (expanded: boolean, record: IItemMaster) => {
    if (expanded) {
      setExpandedRows((prev) => new Set(prev).add(record.sku));
      fetchMovements(record.sku, true);
    } else {
      setExpandedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(record.sku);
        return newSet;
      });
    }
  };

  const handleAddMovement = (record: IItemMaster) => {
    setSelectedItem(record);
    setAddMovementModalOpen(true);
  };

  const handleAddMovementSuccess = async (sku: string) => {
    fetchMovements(sku, true);
    if (onFetchItems) {
      onFetchItems();
    }
  };

  const handleEdit = (record: IItemMaster) => {
    setSelectedItem(record);
    setEditInventoryModalOpen(true);
  };

  const getStockStatusConfig = (status: string) => {
    const configs = {
      [StockStatus.IN_STOCK]: { status: "success" as const, label: "In Stock" },
      [StockStatus.LOW_STOCK]: {
        status: "warning" as const,
        label: "Low Stock",
      },
      [StockStatus.OUT_OF_STOCK]: {
        status: "error" as const,
        label: "Out of Stock",
      },
    };
    return (
      configs[status as keyof typeof configs] || configs[StockStatus.IN_STOCK]
    );
  };

  const renderColumns: ColumnsType<IItemMaster> = [
    {
      title: "Item Master",
      key: "item_master",
      width: 300,
      fixed: "left",
      sorter: (a: IItemMaster, b: IItemMaster) => a.name.localeCompare(b.name),
      render: (_, record: IItemMaster) => (
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
      sorter: (a: IItemMaster, b: IItemMaster) =>
        a.warehouse.localeCompare(b.warehouse),
    },
    {
      title: "QTY",
      dataIndex: "qty",
      key: "qty",
      width: 100,
      align: "center",
      sorter: (a: IItemMaster, b: IItemMaster) => a.qty - b.qty,
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: "Reserve QTY",
      dataIndex: "reserve_qty",
      key: "reserve_qty",
      width: 120,
      align: "center",
      sorter: (a: IItemMaster, b: IItemMaster) => a.reserve_qty - b.reserve_qty,
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: "Stock Status",
      dataIndex: "stock_status",
      key: "stock_status",
      width: 160,
      filters: [
        { text: "In Stock", value: StockStatus.IN_STOCK },
        { text: "Low Stock", value: StockStatus.LOW_STOCK },
        { text: "Out of Stock", value: StockStatus.OUT_OF_STOCK },
      ],
      onFilter: (value, record: IItemMaster) => record.stock_status === value,
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
      sorter: (a: IItemMaster, b: IItemMaster) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      render: (date: string) => format(new Date(date), "MMM d, yyyy h:mm a"),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record: IItemMaster) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined className="text-lg" />}
              onClick={() => handleEdit(record)}
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

  const expandedRowRender = (record: IItemMaster) => {
    const movements = movementsData[record.sku] || [];
    const isLoading = loadingMovements[record.sku];

    if (isLoading) {
      return <div className="p-4 text-center">Loading movements...</div>;
    }

    return (
      <div className="p-2 pl-4 flex flex-col gap-4 overflow-visible bg-white">
        <div className="flex justify-center">
          <div className="flex flex-row gap-4 items-center justify-between w-full">
            <p className="text-md font-bold">Inventory Movement</p>
            <Button
              icon={<PlusCircleOutlined />}
              onClick={() => handleAddMovement(record)}
            >
              Add Movement
            </Button>
          </div>
        </div>
        <Divider className="-my-1" />
        <div className="flex flex-row gap-4">
          <div className="flex-1 min-w-0">
            <ItemMovementChart
              movements={Array.isArray(movements) ? movements : []}
            />
          </div>
          <div className="flex-1 min-w-0 overflow-visible">
            <ItemMovementsTable
              movements={Array.isArray(movements) ? movements : []}
            />
          </div>
        </div>
      </div>
    );
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

      <AddMovementModal
        open={addMovementModalOpen}
        item={selectedItem}
        onCancel={() => {
          setAddMovementModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={() => {
          if (selectedItem) {
            handleAddMovementSuccess(selectedItem.sku);
          }
          setAddMovementModalOpen(false);
          setSelectedItem(null);
        }}
      />

      <EditInventoryModal
        open={editInventoryModalOpen}
        onCancel={() => {
          setEditInventoryModalOpen(false);
          setSelectedItem(null);
        }}
        onSuccess={() => {
          if (selectedItem) {
            onFetchItems?.();
          }
          setEditInventoryModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </>
  );
};

export default TableItems;
