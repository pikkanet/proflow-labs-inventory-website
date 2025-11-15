"use client";

import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, RedoOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";
import { SearchType } from "../../enums/searchType";
import useSearch from "./hooks/useSearch";

interface SearchProps {
  onSearch?: (searchType: SearchType, searchValue: string | string[]) => void;
  filteredCount?: number; // Number of filtered items displayed
  totalCount?: number; // Number of total filtered items
  warehouses?: SelectProps["options"];
  loading?: boolean;
}

const Search = ({
  onSearch,
  filteredCount,
  totalCount,
  warehouses,
  loading,
}: SearchProps) => {
  const {
    searchType,
    searchText,
    setSearchText,
    selectedWarehouses,
    setSelectedWarehouses,
    searchTypeOptions,
    tagRender,
    handleSearch,
    handleReset,
    handleKeyDown,
    handleSearchTypeChange,
    hasActiveFilter,
    displayCount,
    displayTotal,
    isSearchDisabled,
  } = useSearch({ onSearch, filteredCount, totalCount });

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
            showSearch
            tagRender={tagRender}
            placeholder="Select warehouses..."
            value={selectedWarehouses}
            onChange={setSelectedWarehouses}
            options={warehouses}
            loading={loading}
            filterOption={(input, option) => {
              const label = option?.label;
              if (typeof label === "string") {
                return label.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
          />
        )}

        <Button
          className="shadow-none"
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          disabled={isSearchDisabled}
        />
      </Space.Compact>
      <div className="flex items-center py-0 px-3 text-sm text-gray-500 whitespace-nowrap">
        {displayCount.toLocaleString()}/{displayTotal.toLocaleString()} Items
      </div>
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
