"use client";

import TableItems from "./components/itemMaster/TableItems";
import { Button, Divider } from "antd";
import Search from "./components/search/Search";
import {
  DownloadOutlined,
  PlusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import CreateInventoryModal from "./components/modals/CreateInventoryModal";
import InventoryPagination from "./components/pagination/InventoryPagination";
import useInventory from "./hooks/useInventory";

const InventoryPage = () => {
  const {
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
  } = useInventory();

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
          onFetchItems={handleFetchItems}
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
        onCancel={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        warehouses={warehouseOptions}
      />
    </div>
  );
};

export default InventoryPage;
