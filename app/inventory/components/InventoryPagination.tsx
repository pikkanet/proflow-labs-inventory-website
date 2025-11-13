"use client";

import { Select, Input, Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";

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
  const [goToPage, setGoToPage] = useState<string>("");
  const totalPages = Math.ceil(total / pageSize);

  const handlePageSizeChange = (value: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(value);
    }
    onChange(1, value);
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (page >= 1 && page <= totalPages) {
      onChange(page, pageSize);
      setGoToPage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  const handlePrev = () => {
    if (current > 1) {
      onChange(current - 1, pageSize);
    }
  };

  const handleNext = () => {
    if (current < totalPages) {
      onChange(current + 1, pageSize);
    }
  };

  const handlePageClick = (page: number) => {
    onChange(page, pageSize);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

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
            options={[
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
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
          <Button onClick={handleGoToPage} disabled={!goToPage}>
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
            disabled={current === 1}
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
            disabled={current === totalPages}
            size="small"
          />
        </Space>
      </Space>
    </div>
  );
};

export default InventoryPagination;
