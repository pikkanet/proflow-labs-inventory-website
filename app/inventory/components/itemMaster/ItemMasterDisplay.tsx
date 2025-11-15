"use client";

import Image from "@/app/shared/components/Image";

interface ItemMasterDisplayProps {
  name: string;
  sku: string;
  image: string;
}

const ItemMasterDisplay = ({ name, sku, image }: ItemMasterDisplayProps) => {
  return (
    <div className="flex items-center gap-3 min-w-0 w-full">
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
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="font-semibold mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </p>
        <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
          SKU: {sku}
        </p>
      </div>
    </div>
  );
};

export default ItemMasterDisplay;
