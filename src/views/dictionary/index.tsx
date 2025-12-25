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
  Tree,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { DataNode } from "antd/es/tree";
import type { DictListNode, DictTreeNode } from "@/types/dictionary";
import {
  getDictList,
  deleteDict,
  deleteDicts,
  getDictTree,
} from "@/services/dictionary";
import DictionaryModal from "./components/DictionaryModal";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const DictionaryView: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DictListNode[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [parentId, setParentId] = useState<string>("0");
  const [dictId, setDictId] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<number | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 树相关状态
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [selectedTreeKey, setSelectedTreeKey] = useState<string>("0");
  const [expandedKeys, setExpandedKeys] = useState<string[]>(["0"]);

  // 转换树节点数据格式
  const convertToTreeData = (nodes: DictTreeNode[]): DataNode[] => {
    return nodes.map((node) => ({
      key: node.dictId,
      title: node.dictName,
      children: node.children ? convertToTreeData(node.children) : [],
    }));
  };

  // 加载树形数据
  const fetchTreeData = useCallback(async () => {
    // setTreeLoading(true);
    try {
      const tree = await getDictTree("system");
      const treeNodes = convertToTreeData(tree);
      // 添加根节点
      const rootNode: DataNode = {
        key: "0",
        title: "全部字典",
        children: treeNodes,
      };
      setTreeData([rootNode]);
    } catch (error) {
      console.error("Failed to fetch dictionary tree:", error);
    } finally {
      setTreeLoading(false);
    }
  }, []);

  // 加载右侧列表数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const res = await getDictList({
        page: currentPage,
        size: pageSize,
        dictCode: values.dictCode || "",
        dictName: values.dictName || "",
        dictType: "system",
        parentId: selectedTreeKey || "0",
        status: values.status !== undefined ? values.status : undefined,
      });
      setData(res.list);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch dictionary list:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, form, selectedTreeKey]);

  useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

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
      fetchTreeData(); // 刷新树
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleBatchDelete = async () => {
    if (!selectedRowKeys.length) {
      message.warning("请先选择要删除的字典项");
      return;
    }
    try {
      await deleteDicts(selectedRowKeys as string[]);
      message.success("批量删除成功");
      setSelectedRowKeys([]);
      fetchData();
      fetchTreeData();
    } catch (error) {
      console.error("Batch delete error:", error);
    }
  };

  const handleAdd = () => {
    // 计算默认排序：当前列表最大排序值 + 1
    const maxSortOrder =
      data.length > 0
        ? Math.max(...data.map((item) => item.sortOrder || 0))
        : 0;
    setDictId(undefined);
    setParentId(selectedTreeKey || "0");
    setSortOrder(maxSortOrder + 1);
    setModalOpen(true);
  };

  const handleEdit = (record: DictListNode) => {
    setDictId(record.dictId);
    setParentId(record.parentId);
    setSortOrder(record.sortOrder);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    fetchData();
    fetchTreeData(); // 刷新树
  };

  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      setSelectedTreeKey(selectedKeys[0] as string);
      setCurrentPage(1); // 切换节点时重置页码
    }
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
    // {
    //   title: "字典类型",
    //   dataIndex: "dictType",
    //   key: "dictType",
    //   width: 100,
    // },
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
    <div className={cx("container")}>
      <Card
        title="字典分类"
        variant={"borderless"}
        className={cx("leftTree")}
        loading={treeLoading}
      >
        <Tree
          showLine
          treeData={treeData}
          expandedKeys={[...expandedKeys]}
          selectedKeys={selectedTreeKey ? [selectedTreeKey] : []}
          onExpand={(keys) => setExpandedKeys(keys as string[])}
          onSelect={handleTreeSelect}
        />
      </Card>
      <div className={cx("rightContent")}>
        <Card variant={"borderless"} className={cx("searchCard")}>
          <Form
            form={form}
            layout="horizontal"
            onFinish={handleSearch}
            labelCol={{ style: { width: "70px" } }}
          >
            <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col span={8}>
                <Form.Item
                  name="dictName"
                  label="字典名称"
                  style={{ width: "100%", marginBottom: 0 }}
                >
                  <Input placeholder="请输入字典名称" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="dictCode"
                  label="字典编码"
                  style={{ width: "100%", marginBottom: 0 }}
                >
                  <Input placeholder="请输入字典编码" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
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

        <Card variant={"borderless"} className={cx("tableCard")}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              columnGap: 8,
              justifyContent: "flex-end",
            }}
          >
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                新增
              </Button>
            </Space>
            <Space>
              <Popconfirm
                title="确定要批量删除选中项吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={handleBatchDelete}
                disabled={!selectedRowKeys.length}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!selectedRowKeys.length}
                >
                  批量删除
                </Button>
              </Popconfirm>
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="dictId"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
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
      </div>
      <DictionaryModal
        dictId={dictId}
        parentId={parentId}
        sortOrder={sortOrder}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default DictionaryView;
