import { useState } from "react";
import { Tag } from "antd";
import type { SelectProps } from "antd";
import { SearchType } from "../../../enums/searchType";

type TagRender = SelectProps["tagRender"];

interface UseSearchProps {
  onSearch?: (searchType: SearchType, searchValue: string | string[]) => void;
  filteredCount?: number;
  totalCount?: number;
}

const useSearch = ({ onSearch, filteredCount, totalCount }: UseSearchProps) => {
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
      } else {
        onSearch(searchType, searchText);
      }
    }
  };

  const handleReset = () => {
    setSearchText("");
    setSelectedWarehouses([]);
    setSearchType(SearchType.ITEM_MASTER);
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

  const isSearchDisabled =
    !searchType ||
    (searchType === SearchType.WAREHOUSE && selectedWarehouses.length === 0);

  return {
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
  };
};

export default useSearch;

