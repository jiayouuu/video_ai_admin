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
  Tag,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  KeyOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { User } from "@/types/user";
import {
  getUserList,
  deleteUser,
  resetPassword,
  updateUserStatus,
} from "@/services/user";
import UserModal from "./components/UserModal";

const UserView: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await getUserList({
        page: currentPage,
        size: pageSize,
        username: values.username || "",
        nickname: values.nickname || "",
        grade: values.grade || "",
        className: values.className || "",
        status: values.status || "",
      });
      setData(res.list);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
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

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      message.success("删除成功");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      await resetPassword(userId);
      message.success("密码重置成功");
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  const handleUpdateStatus = async (userId: string, currentStatus: string) => {
    // 0正常 1封禁
    // If current is 0, we want to change to 1 (Ban)
    // If current is 1, we want to change to 0 (Unban)
    const newStatus = currentStatus === "0" ? "1" : "0";
    const actionText = newStatus === "0" ? "解封" : "封禁";

    try {
      await updateUserStatus(userId, newStatus);
      message.success(`${actionText}成功`);
      fetchData();
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchData();
  };

  const columns: ColumnsType<User> = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
      width: 150,
    },
    {
      title: "年级",
      dataIndex: "grade",
      key: "grade",
      width: 120,
    },
    {
      title: "班级",
      dataIndex: "className",
      key: "className",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status: string) => {
        // 0正常 1封禁
        const isNormal = status === "0";
        return (
          <Tag color={isNormal ? "success" : "error"}>
            {isNormal ? "正常" : "封禁"}
          </Tag>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 300,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="确定要重置该用户的密码吗？"
            onConfirm={() => handleResetPassword(record.userId)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" icon={<KeyOutlined />}>
              重置密码
            </Button>
          </Popconfirm>

          <Popconfirm
            title={`确定要${record.status === "0" ? "封禁" : "解封"}该用户吗？`}
            onConfirm={() => handleUpdateStatus(record.userId, record.status)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger={record.status === "0"}
              style={{ color: record.status === "1" ? "green" : undefined }}
              icon={
                record.status === "0" ? (
                  <StopOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
            >
              {record.status === "0" ? "封禁" : "解封"}
            </Button>
          </Popconfirm>

          <Popconfirm
            title="确定要删除该用户吗？"
            onConfirm={() => handleDelete(record.userId)}
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
          labelCol={{ style: { width: "60px" } }}
        >
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
                name="username"
                label="用户名"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入用户名" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="nickname"
                label="昵称"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入昵称" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="grade" label="年级" style={{ marginBottom: 0 }}>
                <Input placeholder="请输入年级" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="className"
                label="班级"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入班级" allowClear />
              </Form.Item>
            </Col>
            <Col span={6} style={{ marginTop: 16 }}>
              <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择状态" allowClear>
                  <Select.Option value="0">正常</Select.Option>
                  <Select.Option value="1">封禁</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={18} style={{ marginTop: 16, textAlign: "right" }}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit"
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
          rowKey="userId"
          loading={loading}
          scroll={{ x: 1200 }}
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

      <UserModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default UserView;
