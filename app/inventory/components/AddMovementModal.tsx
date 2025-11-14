"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  Divider,
  Button,
  InputNumber,
  Badge,
} from "antd";
import Swal from "sweetalert2";
import ItemMasterDisplay from "./ItemMasterDisplay";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/services/axiosInstance";
import { ActivityType, Item } from "./TableItems";
import { AxiosError } from "axios";

interface AddMovementModalProps {
  open: boolean;
  item: Item | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

const AddMovementModal = ({
  open,
  item,
  onCancel,
  onSuccess,
}: AddMovementModalProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [noteValue, setNoteValue] = useState("");

  const handleCancel = () => {
    form.resetFields();
    setNoteValue("");
    onCancel();
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const trimmedValue = value.trimStart();
    setNoteValue(trimmedValue);
    form.setFieldValue("note", trimmedValue);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Trim note value before submitting
      const trimmedNote = values.note ? values.note.trim() : null;

      const response = await axiosInstance.post("/item/movements", {
        sku: item?.sku,
        activityType: values.activity,
        qty: values.qty,
        note: trimmedNote || null,
        warehouseId: item?.warehouse_id,
      });
      const { data, status } = response;

      if (status !== 201) {
        const errorData = data.message;
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorData.message || "Failed to add movement",
          confirmButtonColor: "#326A8C",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: data.message,
          confirmButtonColor: "#326A8C",
        });
        form.resetFields();
        setNoteValue("");
        onCancel();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        await Swal.fire({
          icon: "error",
          title: "Add Movement Failed!",
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

  const activityOptions = [
    {
      value: ActivityType.INBOUND,
      label: <Badge status="success" text="Inbound" />,
    },
    {
      value: ActivityType.OUTBOUND,
      label: <Badge status="error" text="Outbound" />,
    },
  ];

  // Calculate character count for trimmed value
  const noteCount = noteValue.trim().length;

  const values = Form.useWatch([], form);

  const [submittable, setSubmittable] = useState<boolean>(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, item, submittable, values]);

  return (
    <Modal
      title="Add Inventory Movement"
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
            disabled={!submittable}
          >
            Confirm
          </Button>
        </div>,
      ]}
      centered
      width={700}
    >
      <Divider className="mt-0 mb-0" />
      {item && (
        <div className="flex items-center gap-4">
          <div className="h-24 flex-1 flex items-center ">
            <p className="font-semibold">{item.warehouse}</p>
          </div>
          <Divider className="h-24 m-0" type="vertical" />
          <div className="h-24 flex-2 flex items-center">
            <ItemMasterDisplay
              name={item.name}
              sku={item.sku}
              image={item.image}
            />
          </div>
        </div>
      )}
      <Divider className="mt-0" />
      <Form form={form} layout="vertical" requiredMark={false}>
        <div className="flex gap-4 items-end">
          <Form.Item
            label="Activity"
            name="activity"
            rules={[{ required: true, message: "Please select activity" }]}
            className="flex-1"
            dependencies={["qty"]}
          >
            <Select
              placeholder="Select activity"
              options={activityOptions}
              onChange={() => {
                form.validateFields(["qty"]);
              }}
            />
          </Form.Item>

          <Form.Item
            label="QTY"
            name="qty"
            rules={[
              { required: true, message: "Please enter quantity" },
              {
                type: "number",
                min: 1,
                message: "Quantity must be greater than 0",
              },
              {
                validator: (_, value) => {
                  if (value && !Number.isInteger(value)) {
                    return Promise.reject(
                      new Error("Quantity must be a whole number")
                    );
                  }
                  if (value && value < 1) {
                    return Promise.reject(
                      new Error("Quantity must be greater than 0")
                    );
                  }
                  const activity = form.getFieldValue("activity");
                  if (activity === ActivityType.OUTBOUND) {
                    if (value > (item?.qty || 0)) {
                      return Promise.reject(
                        new Error(
                          `Quantity must be less than or equal to ${item?.qty}`
                        )
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
            className="flex-1"
          >
            <InputNumber
              placeholder="Enter quantity"
              className="w-full"
              min={1}
              step={1}
              precision={0}
              formatter={(value) => {
                if (!value) return "";
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }}
              onKeyDown={(e) => {
                // Block letters and special characters, allow numbers 0-9 and control keys
                const isNumber = e.key >= "0" && e.key <= "9";
                const isControl =
                  [
                    "Backspace",
                    "Delete",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Home",
                    "End",
                  ].includes(e.key) ||
                  e.ctrlKey ||
                  e.metaKey;
                if (!isNumber && !isControl) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Note"
          name="note"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.trim().length === 0) {
                  return Promise.resolve(); // Allow empty
                }
                const trimmed = value.trim();
                if (trimmed.length > 50) {
                  return Promise.reject(
                    new Error("Note cannot exceed 50 characters")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter note (max 50 characters)"
            value={noteValue}
            onChange={handleNoteChange}
            maxLength={100}
            showCount={{
              formatter: () => `${noteCount}/50`,
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMovementModal;
