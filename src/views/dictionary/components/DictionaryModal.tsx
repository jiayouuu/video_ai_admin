import { useEffect, type FC } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Radio,
  message,
  Row,
  Col,
} from "antd";
import type { DictListNode } from "@/types/dictionary";
import { createDict, updateDict } from "@/services/dictionary";

interface DictionaryModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialValues?: DictListNode | null;
}

const DictionaryModal: FC<DictionaryModalProps> = ({
  open,
  onCancel,
  onSuccess,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: 1,
          sortOrder: 0,
          parentId: "0", // Default root parent
        });
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit && initialValues) {
        await updateDict({ ...values, dictId: initialValues.dictId });
        message.success("更新成功");
      } else {
        await createDict(values);
        message.success("创建成功");
      }
      onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑字典" : "新增字典"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnHidden={true}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 1, sortOrder: 0, parentId: "0" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dictName"
              label="字典名称"
              rules={[{ required: true, message: "请输入字典名称" }]}
            >
              <Input placeholder="请输入字典名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dictCode"
              label="字典编码"
              rules={[{ required: true, message: "请输入字典编码" }]}
            >
              <Input placeholder="请输入字典编码" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dictValue"
              label="字典值"
              rules={[{ required: true, message: "请输入字典值" }]}
            >
              <Input placeholder="请输入字典值" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dictType"
              label="字典类型"
              rules={[{ required: true, message: "请输入字典类型" }]}
            >
              <Input placeholder="请输入字典类型" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="parentId" label="父级ID">
              <Input placeholder="请输入父级ID，默认为0" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sortOrder" label="排序">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="status" label="状态">
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea rows={4} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DictionaryModal;
