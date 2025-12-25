import { useState, useEffect, useCallback, type FC } from "react";
import {
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { DictListNode } from "@/types/dictionary";
import { getDictList, deleteDict } from "@/services/dictionary";
import DictionaryModal from "./components/DictionaryModal";

const DictionaryView: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictListNode[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDict, setEditingDict] = useState<DictListNode | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await getDictList({
        page: currentPage,
        size: pageSize,
        ...values,
        dictCode: values.dictCode || "",
        dictName: values.dictName || "",
        dictType: values.dictType || "",
        parentId: values.parentId || "",
        status: values.status,
      });
      setData(res.list);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch dictionary list:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, form]);

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
      await deleteDict(id);
      message.success("删除成功");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleAdd = () => {
    setEditingDict(null);
    setModalOpen(true);
  };

  const handleEdit = (record: DictListNode) => {
    setEditingDict(record);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchData();
  };

  const columns: ColumnsType<DictListNode> = [
    {
      title: "字典名称",
      dataIndex: "dictName",
      key: "dictName",
      width: 150,
    },
    {
      title: "字典编码",
      dataIndex: "dictCode",
      key: "dictCode",
      width: 150,
    },
    {
      title: "字典值",
      dataIndex: "dictValue",
      key: "dictValue",
      width: 100,
    },
    {
      title: "字典类型",
      dataIndex: "dictType",
      key: "dictType",
      width: 100,
    },
    {
      title: "排序",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 80,
    },
    {
      title: "状态",
      dataIndex: "status",
      align: "center",
      key: "status",
      width: 100,
      render: (status: number) => (
        <span style={{ color: status === 1 ? "green" : "red" }}>
          {status === 1 ? "启用" : "禁用"}
        </span>
      ),
    },
    {
      title: "创建时间",
      align: "center",
      dataIndex: "createTime",
      key: "createTime",
      width: 180,
    },
    {
      title: "操作",
      align: "center",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.dictId)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
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
          labelCol={{ style: { width: "70px" } }}
        >
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            <Col span={6}>
              <Form.Item
                name="dictName"
                label="字典名称"
                style={{ width: "100%", marginBottom: 0 }}
              >
                <Input placeholder="请输入字典名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="dictCode"
                label="字典编码"
                style={{ width: "100%", marginBottom: 0 }}
              >
                <Input placeholder="请输入字典编码" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="dictType"
                label="字典类型"
                style={{ width: "100%", marginBottom: 0 }}
              >
                <Input placeholder="请输入字典类型" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="status"
                label="状态"
                style={{ width: "100%", marginBottom: 0 }}
              >
                <Select
                  placeholder="请选择状态"
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Select.Option value={1}>启用</Select.Option>
                  <Select.Option value={0}>禁用</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  查询
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card variant={"borderless"}>
        <div style={{ marginBottom: 16, textAlign: "right" }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="dictId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      <DictionaryModal
        open={modalOpen}
        initialValues={editingDict}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default DictionaryView;
