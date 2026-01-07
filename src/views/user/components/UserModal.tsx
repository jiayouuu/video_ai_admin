import { useEffect, useState, type FC } from "react";
import { Modal, Form, Input, Row, Col, Select } from "antd";
import { createUser } from "@/services/user";
import { message } from "@/bridges/messageBridge";
import { getDictByParentId } from "@/services/dictionary";
import type { DictListNode } from "@/types/dictionary";

interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserModal: FC<UserModalProps> = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [gradeDict, setGradeDict] = useState<DictListNode[]>([]);
  const fetchGradeDict = async () => {
    try {
      const res = await getDictByParentId("1");
      setGradeDict(res);
    } catch (error) {
      console.error("Failed to fetch grade dictionary:", error);
    }
  };

  useEffect(() => {
    if (open && gradeDict.length === 0) {
      fetchGradeDict();
    }
  }, [open, gradeDict.length]);

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
      width={800}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="手机号"
              rules={[
                { required: true, message: "请输入手机号" },
                { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" },
              ]}
            >
              <Input placeholder="请输入手机号" maxLength={11} />
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
              rules={[{ required: true, message: "请选择年级" }]}
            >
              <Select placeholder="请选择年级">
                {gradeDict.map((item) => (
                  <Select.Option key={item.dictValue} value={item.dictValue}>
                    {item.dictName}
                  </Select.Option>
                ))}
              </Select>
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="kindergartenId"
              label="幼儿园ID"
              rules={[{ required: true, message: "请输入幼儿园ID" }]}
            >
              <Input placeholder="请输入幼儿园ID" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserModal;
