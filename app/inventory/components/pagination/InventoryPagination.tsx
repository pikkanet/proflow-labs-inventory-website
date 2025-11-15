"use client";

import { Select, Input, Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import useInventoryPagination from "./hooks/useInventoryPagination";

interface InventoryPaginationProps {
  total: number;
  current: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const InventoryPagination = ({
  total,
  current,
  pageSize,
  onChange,
  onPageSizeChange,
}: InventoryPaginationProps) => {
  const {
    goToPage,
    setGoToPage,
    totalPages,
    pageSizeOptions,
    handlePageSizeChange,
    handleGoToPage,
    handleKeyPress,
    handlePrev,
    handleNext,
    handlePageClick,
    getPageNumbers,
    isPrevDisabled,
    isNextDisabled,
    isGoToDisabled,
  } = useInventoryPagination({
    total,
    current,
    pageSize,
    onChange,
    onPageSizeChange,
  });

  return (
    <div className="w-full mt-2 flex justify-between items-center ">
      {/* Left */}
      <Space size="middle">
        <Space>
          <span className="text-sm">Items per page:</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="w-20"
            options={pageSizeOptions}
          />
        </Space>
        <Space>
          <span className="text-sm">Go to:</span>
          <Input
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e)}
            placeholder="Page"
            className="w-20"
            type="number"
            min={1}
            max={totalPages}
          />
          <Button onClick={handleGoToPage} disabled={isGoToDisabled}>
            Go
          </Button>
        </Space>
      </Space>

      {/* Right */}
      <Space size="middle">
        <span className="text-sm text-gray-500">Total {total} items</span>
        <Space size="small">
          <Button
            icon={<LeftOutlined />}
            onClick={handlePrev}
            disabled={isPrevDisabled}
            size="small"
          />
          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="px-2">
                  ...
                </span>
              );
            }
            return (
              <Button
                key={page}
                type={current === page ? "primary" : "default"}
                onClick={() => handlePageClick(page as number)}
                size="small"
                className="min-w-[32px] shadow-none"
              >
                {page}
              </Button>
            );
          })}
          <Button
            icon={<RightOutlined />}
            onClick={handleNext}
            disabled={isNextDisabled}
            size="small"
          />
        </Space>
      </Space>
    </div>
  );
};

export default InventoryPagination;
