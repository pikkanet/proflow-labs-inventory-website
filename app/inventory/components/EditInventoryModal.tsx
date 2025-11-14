"use client";

import axiosInstance from "@/app/services/axiosInstance";
import { Modal, Form, Input, Divider, Button, Image } from "antd";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Item } from "./TableItems";

interface EditInventoryModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  item: Item | null;
}

const EditInventoryModal = ({
  open,
  onCancel,
  onSuccess,
  item,
}: EditInventoryModalProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && item) {
      form.setFieldsValue({
        itemMaster: item.name,
      });
    }
  }, [open, item, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const response = await axiosInstance.patch(`/items/${item?.sku}`, {
        name: values.itemMaster,
      });
      const { data, status } = response;

      if (status !== 200) {
        const errorData = data.message;
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorData.message || "Failed to update inventory item",
          confirmButtonColor: "#326A8C",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Inventory item updated successfully",
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
          title: "Update Inventory Failed!",
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
          <p className="text-lg font-semibold">Edit Inventory</p>
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

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="w-[80px] h-[80px] flex-shrink-0">
          <Image
            src={item?.image}
            alt={item?.name}
            width={80}
            height={80}
            className="object-cover rounded"
            preview={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              label="Item Master"
              name="itemMaster"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value || value.trim().length === 0) {
                      return Promise.reject(
                        new Error("Please enter item master")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Enter item master" maxLength={100}/>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default EditInventoryModal;
