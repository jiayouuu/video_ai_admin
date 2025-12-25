import { useEffect, type FC } from "react";
import { Modal, Form, Input, message, Row, Col } from "antd";
import { createUser } from "@/services/user";

interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserModal: FC<UserModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createUser(values);
      message.success("创建成功");
      onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Modal
      title="新增用户"
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnHidden={true}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="nickname"
              label="昵称"
              rules={[{ required: true, message: "请输入昵称" }]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="grade"
              label="年级"
              rules={[{ required: true, message: "请输入年级" }]}
            >
              <Input placeholder="请输入年级" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="className"
              label="班级"
              rules={[{ required: true, message: "请输入班级" }]}
            >
              <Input placeholder="请输入班级" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserModal;
