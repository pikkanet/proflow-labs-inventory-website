"use client";

import { Image } from "antd";

interface ItemMasterDisplayProps {
  name: string;
  sku: string;
  image: string;
}

const ItemMasterDisplay = ({ name, sku, image }: ItemMasterDisplayProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[60px] h-[60px] flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={60}
          height={60}
          className="object-cover rounded"
          preview={false}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold mb-1">{name}</p>
        <p className="text-sm text-gray-500">SKU: {sku}</p>
      </div>
    </div>
  );
};

export default ItemMasterDisplay;
