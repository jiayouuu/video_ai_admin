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
import { createDict, updateDict, getDictById } from "@/services/dictionary";

interface DictionaryModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  dictId?: string;
  parentId: string;
  sortOrder?: number;
}

const DictionaryModal: FC<DictionaryModalProps> = ({
  open,
  onCancel,
  onSuccess,
  dictId,
  parentId,
  sortOrder,
}) => {
  const [form] = Form.useForm();

  const getDictDetails = async (dictId: string) => {
    try {
      const data = await getDictById(dictId);
      form.setFieldsValue({
        ...data,
      });
    } catch (error) {
      console.error("Fetch dict details error:", error);
    }
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
      if (dictId) {
        getDictDetails(dictId);
      } else {
        form.setFieldsValue({
          status: 1,
          sortOrder: sortOrder || 0,
          parentId: parentId || "0",
        });
      }
    }
  }, [open, dictId, parentId, sortOrder, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (dictId) {
        await updateDict({ ...values, dictId });
        message.success("更新成功");
      } else {
        await createDict({ ...values, parentId, dictType: "system" });
        message.success("创建成功");
      }
      onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Modal
      title={dictId ? "编辑字典" : "新增字典"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnHidden={true}
      width={800}
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
            <Form.Item name="sortOrder" label="排序">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="status" label="状态">
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={4} placeholder="请输入备注" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DictionaryModal;
