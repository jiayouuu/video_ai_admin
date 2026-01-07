import { useEffect, useState, type FC } from "react";
import { Modal, Form, Input, Row, Col, Select, DatePicker } from "antd";
import {
  createKindergarten,
  updateKindergarten,
} from "@/services/kindergarten";
import { message } from "@/bridges/messageBridge";
import { getKindergarten } from "@/services/kindergarten";
import dayjs from "dayjs";
import type { DictListNode } from "@/types/dictionary";
import { getDictByParentId } from "@/services/dictionary";

interface KindergartenModalProps {
  open: boolean;
  kindergartenId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const KindergartenModal: FC<KindergartenModalProps> = ({
  open,
  kindergartenId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [kindergartenTypeDict, setKindergartenTypeDict] = useState<
    Array<DictListNode>
  >([]);

  const fetchKindergartenTypeDict = async () => {
    try {
      const res = await getDictByParentId("5");
      setKindergartenTypeDict(res);
    } catch (error) {
      console.error("Failed to fetch kindergartenType dictionary:", error);
    }
  };

  useEffect(() => {
    if (open && kindergartenTypeDict.length === 0) {
      fetchKindergartenTypeDict();
    }
  }, [open, kindergartenTypeDict.length]);

  const fetchKindergartenData = async (kindergartenId: string) => {
    try {
      const data = await getKindergarten(kindergartenId);
      form.setFieldsValue({
        ...data,
        establishmentDate: data.establishmentDate
          ? dayjs(data.establishmentDate)
          : undefined,
      });
    } catch (error) {
      console.error("Failed to fetch kindergarten data:", error);
    }
  };

  useEffect(() => {
    if (open) {
      if (kindergartenId) {
        fetchKindergartenData(kindergartenId);
      } else {
        form.resetFields();
      }
    }
  }, [open, kindergartenId, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      // 格式化表单字段
      const formattedValues = {
        ...values,
        establishmentDate: values.establishmentDate
          ? dayjs(values.establishmentDate).format("YYYY-MM-DDTHH:mm:ss")
          : "",
        // 默认为启用
        status: values.status ?? 1,
      };
      if (kindergartenId) {
        await updateKindergarten({
          ...formattedValues,
          kindergartenId,
        });
        message.success("修改成功");
      } else {
        await createKindergarten(formattedValues);
        message.success("创建成功");
      }
      onSuccess();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title={kindergartenId ? "编辑幼儿园" : "新增幼儿园"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnHidden
      maskClosable={false}
      width={1000}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="kindergartenName"
              label="全称"
              rules={[{ required: true, message: "请输入全称" }]}
            >
              <Input placeholder="请输入全称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="shortName"
              label="简称"
              rules={[{ required: true, message: "请输入简称" }]}
            >
              <Input placeholder="请输入简称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="englishName" label="英文名称">
              <Input placeholder="请输入英文名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="kindergartenType"
              label="类型"
              rules={[{ required: true, message: "请选择类型" }]}
            >
              <Select placeholder="请选择类型" allowClear>
                {kindergartenTypeDict.map((item) => (
                  <Select.Option key={item.dictValue} value={item.dictValue}>
                    {item.dictName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="level"
              label="等级"
              rules={[{ required: true, message: "请输入等级" }]}
            >
              <Input placeholder="如：省级示范、市级示范" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="establishmentDate" label="建园日期">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="provinceName"
              label="省份"
              rules={[{ required: true, message: "请输入省份" }]}
            >
              <Input placeholder="请输入省份" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="cityName"
              label="城市"
              rules={[{ required: true, message: "请输入城市" }]}
            >
              <Input placeholder="请输入城市" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="districtName"
              label="区县"
              rules={[{ required: true, message: "请输入区县" }]}
            >
              <Input placeholder="请输入区县" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="detailedAddress"
              label="详细地址"
              rules={[{ required: true, message: "请输入详细地址" }]}
            >
              <Input placeholder="请输入详细地址" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="postalCode" label="邮政编码">
              <Input placeholder="请输入邮政编码" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="principal"
              label="校长"
              rules={[{ required: true, message: "请输入校长姓名" }]}
            >
              <Input placeholder="请输入校长姓名" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="principalPhone"
              label="校长电话"
              rules={[
                { required: true, message: "请输入校长电话" },
                {
                  pattern: /^(?:0\d{2,3}-\d{7,8}|1[3-9]\d{9})$/,
                  message: "请输入有效的校长电话",
                },
              ]}
            >
              <Input placeholder="请输入校长电话" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mainPhone"
              label="管理员电话"
              rules={[
                { required: true, message: "请输入管理员电话" },
                {
                  pattern: /^(?:0\d{2,3}-\d{7,8}|1[3-9]\d{9})$/,
                  message: "请输入有效的管理员电话",
                },
              ]}
            >
              <Input placeholder="请输入管理员电话" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="telephone"
              label="联系电话"
              rules={[
                {
                  pattern: /^(?:0\d{2,3}-\d{7,8}|1[3-9]\d{9})$/,
                  message: "请输入有效的联系电话",
                },
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="email"
              label="电子邮箱"
              rules={[{ type: "email", message: "请输入有效的电子邮箱" }]}
            >
              <Input placeholder="请输入电子邮箱" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="状态" initialValue={1}>
              <Select>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="officialWebsite"
              label="官方网站"
              rules={[{ type: "url", message: "请输入有效的官方网站地址" }]}
            >
              <Input placeholder="请输入官方网站地址" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default KindergartenModal;
