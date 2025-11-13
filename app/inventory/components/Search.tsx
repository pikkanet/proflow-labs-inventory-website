"use client";

import { Input, Select, Space, Button, Tag } from "antd";
import { SearchOutlined, RedoOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { SelectProps } from "antd";

interface SearchProps {
  onSearch?: (searchType: SearchType, searchValue: string | string[]) => void;
  filteredCount?: number; // Number of filtered items displayed
  totalCount?: number; // Number of total filtered items
  warehouses?: SelectProps["options"];
}

type TagRender = SelectProps["tagRender"];

export enum SearchType {
  ITEM_MASTER = "item-master",
  WAREHOUSE = "warehouse",
}

const Search = ({
  onSearch,
  filteredCount,
  totalCount,
  warehouses,
}: SearchProps) => {
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(
    SearchType.ITEM_MASTER
  );
  const [searchText, setSearchText] = useState("");
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredTotalCount, setFilteredTotalCount] = useState<
    number | undefined
  >(undefined);

  const searchTypeOptions = [
    { value: SearchType.ITEM_MASTER, label: "Item Master" },
    { value: SearchType.WAREHOUSE, label: "Warehouse" },
  ];

  const tagRender: TagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };

  const handleSearch = () => {
    setIsFiltered(true);
    if (onSearch) {
      if (searchType === SearchType.WAREHOUSE) {
        onSearch(searchType, selectedWarehouses);
        // When warehouse is selected, filteredTotalCount should be the total for that warehouse
        // This should be set by the parent component based on the search results
      } else {
        onSearch(searchType, searchText);
      }
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedWarehouses([]);
    setIsFiltered(false);
    setFilteredTotalCount(undefined);
    if (onSearch) {
      onSearch(SearchType.ITEM_MASTER, "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
    setSearchText("");
    setSelectedWarehouses([]);
    setIsFiltered(false);
    setFilteredTotalCount(undefined);
  };

  const hasActiveFilter =
    isFiltered &&
    ((searchType === SearchType.ITEM_MASTER && searchText) ||
      (searchType === SearchType.WAREHOUSE && selectedWarehouses.length > 0));

  // Calculate display count
  const displayCount = filteredCount ?? 0;
  const displayTotal = filteredTotalCount ?? totalCount ?? 0;
  const showCount = displayCount > 0 || displayTotal > 0;

  return (
    <div className="w-full flex items-center gap-3">
      <Space.Compact className="w-full">
        <Select
          className="w-40"
          placeholder="Select search type"
          options={searchTypeOptions}
          value={searchType}
          onChange={handleSearchTypeChange}
        />

        {searchType === SearchType.ITEM_MASTER && (
          <Input
            className="flex-1"
            placeholder="Item master"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        {searchType === SearchType.WAREHOUSE && (
          <Select
            className="flex-1"
            mode="multiple"
            tagRender={tagRender}
            placeholder="Select warehouses..."
            value={selectedWarehouses}
            onChange={setSelectedWarehouses}
            options={warehouses}
            loading={loading}
          />
        )}

        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          disabled={
            !searchType ||
            (searchType === SearchType.ITEM_MASTER && !searchText) ||
            (searchType === SearchType.WAREHOUSE &&
              selectedWarehouses.length === 0)
          }
        />
      </Space.Compact>
      {showCount && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontSize: 14,
            color: "#666",
            whiteSpace: "nowrap",
          }}
        >
          {displayCount.toLocaleString()}/{displayTotal.toLocaleString()} Items
        </div>
      )}
      <Button
        icon={<RedoOutlined />}
        onClick={handleReset}
        disabled={!hasActiveFilter}
      >
        Reset
      </Button>
    </div>
  );
};

export default Search;
