import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import Swal from "sweetalert2";
import { useRefresh } from "../../contexts/RefreshContext";
import { SearchType } from "../enums/searchType";
import { IItemMaster, IItemMasterResponse } from "../types/itemMaster";
import { IWarehouse, IWarehouseResponse } from "../types/warehouse";

const useInventory = () => {
  const [items, setItems] = useState<IItemMaster[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);

  const [filteredCount, setFilteredCount] = useState<number | undefined>(20);
  const [totalCount, setTotalCount] = useState<number | undefined>(21);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);

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

        const response = await axiosInstance.get<IItemMasterResponse>(
          "/items",
          {
            params: params,
          }
        );

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
      const response = await axiosInstance.get<IWarehouseResponse>(
        "/warehouses"
      );
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

  const handleFetchItems = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  useEffect(() => {
    fetchItems(currentPage, pageSize);
  }, [searchType, searchValue, currentPage, fetchItems, pageSize]);

  return {
    items,
    loadingItems,
    loadingWarehouses,
    filteredCount,
    totalCount,
    currentPage,
    pageSize,
    isCreateModalOpen,
    warehouseOptions,
    handleCreate,
    handleExport,
    handlePaginationChange,
    handlePageSizeChange,
    handleSearch,
    handleRefresh,
    handleCreateSuccess,
    handleFetchItems,
    handleCloseCreateModal,
  };
};

export default useInventory;

