import { useState, useEffect, useCallback, type FC } from "react";
import {
  Table,
  Button,
  Space,
  Form,
  Input,
  Select,
  Popconfirm,
  Card,
  Row,
  Col,
  Tag,
  // Avatar,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  KeyOutlined,
  StopOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  // UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { User } from "@/types/user";
import {
  getUserList,
  deleteUser,
  resetPassword,
  updateUserStatus,
  getUserInfoById,
} from "@/services/user";
import UserModal from "./components/UserModal";
import UserDetailModal from "./components/UserDetailModal";
// import AvatarModal from "./components/AvatarModal";
import { message } from "@/bridges/messageBridge";
import type { DictListNode } from "@/types/dictionary";
import { getDictByParentId } from "@/services/dictionary";
import dayjs from "dayjs";

const UserView: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [gradeDict, setGradeDict] = useState<Array<DictListNode>>([]);

  // 详情弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<User | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 头像弹窗状态
  // const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  // const [currentUserId, setCurrentUserId] = useState<string>("");
  // const [currentImage, setCurrentImage] = useState<string | File>("");

  const fetchGradeDict = async () => {
    try {
      const res = await getDictByParentId("1");
      setGradeDict(res);
    } catch (error) {
      console.error("Failed to fetch grade dictionary:", error);
    }
  };

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
      setData(
        res.list.map(
          (item) =>
            Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k, v ?? "--"]),
            ) as User,
        ),
      );
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch user list:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, form]);

  useEffect(() => {
    fetchGradeDict();
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
    const newStatus = currentStatus === "0" ? "1" : "0";
    const actionText = newStatus === "0" ? "解封" : "封禁";
    try {
      const params = { userId, status: newStatus };
      await updateUserStatus(params);
      message.success(`${actionText}成功`);
      fetchData();
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  const handleAdd = () => {
    setModalOpen(true);
  };

  const handleDetail = async (userId: string) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    // 重置数据，避免显示上一次的缓存
    setDetailData(undefined);
    try {
      const res = await getUserInfoById(userId);
      setDetailData(res);
    } catch (error) {
      console.error("Fetch detail error:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchData();
  };
  // const selectImage = (): Promise<File> => {
  //   return new Promise((resolve, reject) => {
  //     const input = document.createElement("input");
  //     input.type = "file";
  //     const allowedTypes = JSON.parse(
  //       import.meta.env.VITE_UPLOAD_IMAGE_TYPES || '["jpg","png","jpeg"]'
  //     );
  //     input.accept = allowedTypes.map((type: string) => `.${type}`).join(",");
  //     input.click();
  //     input.onchange = () => {
  //       if (input.files && input.files[0]) {
  //         const file = input.files[0];
  //         const fileType = file.type.split("/")[1];
  //         if (!allowedTypes.includes(fileType)) {
  //           reject(new Error("不支持的图片格式"));
  //           return;
  //         }
  //         const sizeLimitMB = Number(
  //           import.meta.env.VITE_UPLOAD_IMAGE_SIZE_LIMIT || 2
  //         );
  //         if (file.size / 1024 / 1024 > sizeLimitMB) {
  //           reject(new Error(`图片大小不能超过${sizeLimitMB}MB`));
  //           return;
  //         }
  //         resolve(file);
  //       } else {
  //         reject(new Error("未选择图片"));
  //       }
  //     };
  //   });
  // };
  // const handleAvatarModal = async (userId: string): Promise<void> => {
  //   try {
  //     const file = await selectImage();
  //     setCurrentUserId(userId);
  //     setCurrentImage(file);
  //     setAvatarModalOpen(true);
  //   } catch (error) {
  //     console.error(error);
  //     message.error((error as Error).message);
  //   }
  // };

  // const handleAvatarSuccess = () => {
  //   fetchData();
  // };

  const columns: ColumnsType<User> = [
    {
      title: "账号",
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
    // {
    //   title: "头像",
    //   dataIndex: "faceImage",
    //   key: "faceImage",
    //   align: "center",
    //   width: 100,
    //   render: (_, record) => (
    //     <Avatar src={import.meta.env.VITE_API_HOST + record.faceImage}></Avatar>
    //   ),
    // },
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
      render: (_, record) =>
        dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "action",
      align: "center",
      width: 400,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {/* <Button
            type="link"
            icon={<UserOutlined />}
            onClick={() => handleAvatarModal(record.userId)}
          >
            头像
          </Button> */}

          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleDetail(record.userId)}
          >
            详情
          </Button>

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
                label="账号"
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入账号" allowClear />
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
                <Select placeholder="请选择年级" allowClear>
                  {gradeDict.map((item) => (
                    <Select.Option key={item.dictValue} value={item.dictValue}>
                      {item.dictName}
                    </Select.Option>
                  ))}
                </Select>
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
            <Col span={6} style={{ marginBottom: 0 }}>
              <Form.Item name="status" label="状态" style={{ marginBottom: 0 }}>
                <Select placeholder="请选择状态" allowClear>
                  <Select.Option value="0">正常</Select.Option>
                  <Select.Option value="1">封禁</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={18} style={{ marginBottom: 0, textAlign: "right" }}>
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
        <div style={{ marginBottom: 8, textAlign: "right" }}>
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
      <UserDetailModal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        data={detailData}
        loading={detailLoading}
      />
      {/* <AvatarModal
        open={avatarModalOpen}
        userId={currentUserId}
        image={currentImage}
        onCancel={() => setAvatarModalOpen(false)}
        onSuccess={handleAvatarSuccess}
      /> */}
    </div>
  );
};

export default UserView;
