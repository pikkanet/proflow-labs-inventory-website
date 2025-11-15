"use client";

import axiosInstance from "@/app/services/axiosInstance";
import { Modal, Form, Input, Select, Divider, Button, SelectProps } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  ICreateItemMasterRequest,
  ICreateItemMasterResponse,
} from "../../types/createItemMaster";
import { ITEM_MASTER_MAX_LENGTH } from "../../constants/itemMaster";

interface CreateInventoryModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  warehouses: SelectProps["options"];
}

const images = [
  {
    image: "https://dummyimage.com/600x400/B0E/B0E",
  },
  {
    image: "https://dummyimage.com/600x400/DDC/DDC",
  },
  {
    image: "https://dummyimage.com/600x400/EDC/EDC",
  },
  {
    image: "https://dummyimage.com/600x400/FFB/FFB",
  },
  {
    image: "https://dummyimage.com/600x400/F9C/F9C",
  },
  {
    image: "https://dummyimage.com/600x400/FF8/FF8",
  },
  {
    image: "https://dummyimage.com/600x400/DDB/DDB",
  },
  {
    image: "https://dummyimage.com/600x400/E6E/E6E",
  },
  {
    image: "https://dummyimage.com/600x400/EDC/EDC",
  },
  {
    image: "https://dummyimage.com/600x400/FF8/FF8",
  },
  {
    image: "https://dummyimage.com/600x400/FFD/FFD",
  },
  {
    image: "https://dummyimage.com/600x400/DDD/DDD",
  },
  {
    image: "https://dummyimage.com/600x400/DDC/DDC",
  },
  {
    image: "https://dummyimage.com/600x400/9A8/9A8",
  },
  {
    image: "https://dummyimage.com/600x400/FFD/FFD",
  },
  {
    image: "https://dummyimage.com/600x400/EDC/EDC",
  },
  {
    image: "https://dummyimage.com/600x400/F9C/F9C",
  },
  {
    image: "https://dummyimage.com/600x400/FF7/FF7",
  },
  {
    image: "https://dummyimage.com/600x400/A87/A87",
  },
  {
    image: "https://dummyimage.com/600x400/DDB/DDB",
  },
  {
    image: "https://dummyimage.com/600x400/9F8/9F8",
  },
];

const CreateInventoryModal = ({
  open,
  onCancel,
  onSuccess,
  warehouses,
}: CreateInventoryModalProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const randomIndex = Math.floor(Math.random() * images.length);
      const image = images[randomIndex].image;
      const request: ICreateItemMasterRequest = {
        name: values.itemMaster,
        image,
        warehouse_id: values.warehouse,
      };

      const response = await axiosInstance.post<ICreateItemMasterResponse>(
        "/items",
        request
      );
      const { data, status } = response;

      if (status !== 201) {
        const errorData = data.message;
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorData || "Failed to create inventory item",
          confirmButtonColor: "#326A8C",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Inventory item created successfully",
          confirmButtonColor: "#326A8C",
        });
        form.resetFields();
        onCancel();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        return;
      }
      if (error instanceof AxiosError) {
        await Swal.fire({
          icon: "error",
          title: "Create Inventory Failed!",
          text: error.response?.data?.message,
          confirmButtonColor: "#326A8C",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Please try again later",
          confirmButtonColor: "#326A8C",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div>
          <p className="text-lg font-semibold">Create Inventory</p>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={[
        <Divider key="divider" className="mb-4" />,
        <div key="buttons" className="flex justify-end gap-2">
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            key="confirm"
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
          >
            Confirm
          </Button>
        </div>,
      ]}
      centered
      width={600}
    >
      <Divider className="mt-0 mb-4" />
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="Item Master"
          name="itemMaster"
          rules={[
            { required: true, message: "Please enter item master" },
            {
              validator: (_, value) => {
                if (!value || value.trim().length === 0) {
                  return Promise.reject(
                    new Error(
                      "Item Master cannot be empty or contain only spaces"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter item master"
            maxLength={ITEM_MASTER_MAX_LENGTH}
          />
        </Form.Item>

        <Form.Item
          label="Warehouse"
          name="warehouse"
          rules={[{ required: true, message: "Please select warehouse" }]}
        >
          <Select
            placeholder="Select warehouse"
            options={warehouses}
            showSearch
            filterOption={(input, option) => {
              const label = option?.label;
              if (typeof label === "string") {
                return label.toLowerCase().includes(input.toLowerCase());
              }
              return false;
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateInventoryModal;
