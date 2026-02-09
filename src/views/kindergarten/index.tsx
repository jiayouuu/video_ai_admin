/*
 * @Author: 桂佳囿
 * @Date: 2025-12-31 17:49:07
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-02-09 15:14:27
 * @Description: 幼儿园管理视图
 */
import { useState, useEffect, useCallback, type FC } from "react";
import {
  Table,
  Button,
  Space,
  Form,
  Input,
  Popconfirm,
  Card,
  Row,
  Col,
  Tag,
  Select,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  // DeleteOutlined,
  // EditOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { BaseKindergartenInfo } from "@/types/kindergarten";
import {
  getKindergartenList,
  deleteKindergarten,
} from "@/services/kindergarten";
import KindergartenModal from "./components/KindergartenModal";
import { message } from "@/bridges/messageBridge";
import dayjs from "dayjs";
import type { DictListNode } from "@/types/dictionary";
import { getDictByParentId } from "@/services/dictionary";

const KindergartenView: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BaseKindergartenInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [kindergartenTypeDict, setKindergartenTypeDict] = useState<
    Array<DictListNode>
  >([]);
  // 弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [kindergartenId, setKindergartenId] = useState<string | undefined>(
    undefined,
  );

  const fetchKindergartenTypeDict = async () => {
    try {
      const res = await getDictByParentId("5");
      setKindergartenTypeDict(res);
    } catch (error) {
      console.error("Failed to fetch kindergartenType dictionary:", error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await getKindergartenList({
        page: currentPage,
        size: pageSize,
        kindergartenName: values.kindergartenName || "",
        kindergartenType: values.kindergartenType || "",
        level: values.level || "",
        provinceName: "",
        cityName: "",
        districtName: "",
        status: values.status ?? "",
      });
      setData(
        res.list.map(
          (item) =>
            Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k, v ?? "--"]),
            ) as BaseKindergartenInfo,
        ),
      );
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch kindergarten list:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, form]);

  useEffect(() => {
    fetchKindergartenTypeDict();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleReset = () => {
    form.resetFields();
    handleSearch();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKindergarten(id);
      message.success("删除成功");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleAdd = () => {
    setKindergartenId(undefined);
    setModalOpen(true);
  };

  const handleEdit = (record: BaseKindergartenInfo) => {
    setKindergartenId(record.kindergartenId);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchData();
  };

  const columns: ColumnsType<BaseKindergartenInfo> = [
    {
      title: "全称",
      dataIndex: "kindergartenName",
      key: "kindergartenName",
      width: 200,
    },
    {
      title: "简称",
      dataIndex: "shortName",
      key: "shortName",
      width: 150,
    },
    {
      title: "类型",
      dataIndex: "kindergartenType",
      key: "kindergartenType",
      align: "center",
      width: 100,
    },
    {
      title: "等级",
      dataIndex: "level",
      key: "level",
      align: "center",
      width: 100,
    },
    {
      title: "地区",
      key: "area",
      width: 200,
      render: (_, record) =>
        `${record.provinceName}-${record.cityName}-${record.districtName}`,
    },
    {
      title: "校长",
      dataIndex: "principal",
      key: "principal",
      width: 100,
    },
    {
      title: "联系电话",
      dataIndex: "telephone",
      key: "telephone",
      width: 150,
    },
    {
      title: "积分",
      dataIndex: "token",
      key: "token",
      width: 100,
      align: "left",
      render: (_, record) => `${record.tokenShareNumber}/${record.tokenNumber}`,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      align: "center",
      render: (status: number) => (
        <Tag color={status === 1 ? "success" : "error"}>
          {status === 1 ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 180,
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            // icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.kindergartenId)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              // icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card variant={"borderless"} style={{ marginBottom: 10 }}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSearch}
          labelCol={{ style: { width: "60px" } }}
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
                name="kindergartenName"
                label="全称"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入全称" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="kindergartenType"
                label="类型"
                style={{ marginBottom: 0 }}
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
            <Col span={6}>
              <Form.Item name="level" label="等级" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入等级" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择状态" allowClear>
                  <Select.Option value="1">启用</Select.Option>
                  <Select.Option value="0">禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  查询
                </Button>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card variant={"borderless"}>
        <div style={{ marginBottom: 8, textAlign: "right" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="kindergartenId"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      <KindergartenModal
        open={modalOpen}
        kindergartenId={kindergartenId}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default KindergartenView;
