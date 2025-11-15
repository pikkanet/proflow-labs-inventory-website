import { useState } from "react";

interface UseInventoryPaginationProps {
  total: number;
  current: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const useInventoryPagination = ({
  total,
  current,
  pageSize,
  onChange,
  onPageSizeChange,
}: UseInventoryPaginationProps) => {
  const [goToPage, setGoToPage] = useState<string>("");
  const totalPages = Math.ceil(total / pageSize);

  const pageSizeOptions = [
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

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

  const isPrevDisabled = current === 1;
  const isNextDisabled = current === totalPages;
  const isGoToDisabled = !goToPage;

  return {
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
  };
};

export default useInventoryPagination;

