"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import TableItems, { StockStatus } from "./components/TableItems";
import { Button, Divider } from "antd";
import InventoryPagination from "./components/InventoryPagination";
import Search, { SearchType } from "./components/Search";
import {
  DownloadOutlined,
  PlusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import axiosInstance from "../services/axiosInstance";
import Swal from "sweetalert2";
import { Warehouse } from "./types";
import CreateInventoryModal from "./components/CreateInventoryModal";
import { useRefresh } from "../contexts/RefreshContext";

interface Item {
  sku: string;
  name: string;
  warehouse: string;
  warehouse_id: number;
  qty: number;
  reserve_qty: number;
  stock_status: StockStatus;
  updated_at: string;
  is_show: boolean;
  image: string;
}

const InventoryPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);

  const [filteredCount, setFilteredCount] = useState<number | undefined>(20);
  const [totalCount, setTotalCount] = useState<number | undefined>(21);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const [searchType, setSearchType] = useState<SearchType>(
    SearchType.ITEM_MASTER
  );
  const [searchValue, setSearchValue] = useState<string | string[]>("");

  const { refresh } = useRefresh();

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleExport = () => {
    console.log("Export triggered");
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    fetchItems(page, size);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchItems(1, size);
  };

  const fetchItems = useCallback(
    async (page?: number, size?: number) => {
      try {
        setLoadingItems(true);

        const params: Record<string, string | number> = {
          page: page ?? currentPage,
          pageSize: size ?? pageSize,
        };
        if (searchType === SearchType.ITEM_MASTER) {
          params.name = searchValue as string;
        } else if (searchType === SearchType.WAREHOUSE) {
          params.warehouseIds = (searchValue as string[]).join(",");
        }

        const response = await axiosInstance.get("/items", {
          params: params,
        });

        const { data, status } = response;
        if (status !== 200) {
          throw new Error(data.message);
        }
        const result = data.data || [];
        setFilteredCount(result.length);
        setTotalCount(data.totalItems);
        setItems(result);
      } catch {
        await Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Please try again later",
          confirmButtonColor: "#326A8C",
        });
      } finally {
        setLoadingItems(false);
      }
    },
    [currentPage, pageSize, searchType, searchValue]
  );

  const fetchWarehouses = useCallback(async () => {
    try {
      setLoadingWarehouses(true);
      const response = await axiosInstance.get("/warehouses");
      const { data, status } = response;
      if (status !== 200) {
        throw new Error(data.message);
      }

      const result = data.data || [];
      setWarehouses(result);
    } catch {
    } finally {
      setLoadingWarehouses(false);
    }
  }, []);

  const handleSearch = useCallback(
    (type: SearchType, value: string | string[]) => {
      setSearchType(type);
      setSearchValue(value);
      setCurrentPage(1);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    refresh();
    fetchItems();
    fetchWarehouses();
  }, [refresh, fetchItems, fetchWarehouses]);

  const warehouseOptions = useMemo(() => {
    return warehouses?.map((warehouse) => ({
      value: warehouse.id,
      label: warehouse.name,
    }));
  }, [warehouses]);

  const handleCreateSuccess = () => {
    fetchItems();
  };

  const handleAddedMovement = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  useEffect(() => {
    fetchItems(currentPage, pageSize);
  }, [searchType, searchValue, currentPage, fetchItems, pageSize]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="w-full flex items-center gap-3">
        <Search
          onSearch={handleSearch}
          filteredCount={filteredCount}
          totalCount={totalCount}
          warehouses={warehouseOptions}
          loading={loadingWarehouses}
        />
        <Button icon={<PlusCircleOutlined />} onClick={handleCreate}>
          Create
        </Button>
        <Button icon={<SyncOutlined />} onClick={handleRefresh} />
        <Button disabled icon={<DownloadOutlined />} onClick={handleExport} />
      </div>
      <Divider className="my-2" />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <TableItems
          items={items}
          loading={loadingItems}
          onAddedMovement={handleAddedMovement}
        />
      </div>
      <InventoryPagination
        total={totalCount || 0}
        current={currentPage}
        pageSize={pageSize}
        onChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <CreateInventoryModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        warehouses={warehouseOptions}
      />
    </div>
  );
};

export default InventoryPage;
