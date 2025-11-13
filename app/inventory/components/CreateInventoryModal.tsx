"use client";

import axiosInstance from "@/app/services/axiosInstance";
import { Modal, Form, Input, Select, Divider, Button, SelectProps } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";

interface CreateInventoryModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  warehouses: SelectProps["options"];
}

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
      const randomColor = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      const image = `https://dummyimage.com/600x400/${randomColor}/fff&text=${values.itemMaster[0]}`;

      const response = await axiosInstance.post("/items", {
        name: values.itemMaster,
        image,
        warehouse_id: values.warehouse,
      });
      const { data, status } = response;

      if (status !== 201) {
        const errorData = data.message;
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorData.message || "Failed to create inventory item",
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
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An unexpected error occurred",
        confirmButtonColor: "#326A8C",
      });
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
          <Input placeholder="Enter item master" />
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
