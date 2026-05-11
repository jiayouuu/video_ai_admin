import { Button, Card, Input, Select, Space, Table, Tag } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { getLogList } from "@/services/monitor";
import type { LogItem } from "@/types/monitor";
import type { ColumnsType } from "antd/es/table";
import styles from "@/views/monitor/index.module.scss";
import { debounce } from "lodash";

const columns: ColumnsType<LogItem> = [
  { title: "任务ID", dataIndex: "requestId", key: "requestId", minWidth: 160 },
  { title: "类型", dataIndex: "typeName", key: "typeName", minWidth: 120 },
  { title: "用户ID", dataIndex: "userId", key: "userId", minWidth: 120 },
  // { title: "用户名称", dataIndex: "nickName", key: "nickName", minWidth: 120 },
  // { title: "请求路径", dataIndex: "path", key: "path", minWidth: 180 },
  {
    title: "开始时间",
    dataIndex: "requestTime",
    key: "requestTime",
    minWidth: 180,
    render: (value: string) =>
      value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "--",
  },
  {
    title: "耗时(ms)",
    dataIndex: "timeCost",
    key: "timeCost",
    minWidth: 110,
    align: "right",
  },
  {
    title: "状态",
    dataIndex: "success",
    key: "success",
    minWidth: 90,
    align: "center",
    render: (status: number) => (
      <Tag color={status ? "success" : "error"}>{status ? "成功" : "失败"}</Tag>
    ),
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 100,
    render: () => <Button type="link">查看详情</Button>,
    align: "center",
  },
];

const CallRecordsPanel = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [userIdInput, setUserIdInput] = useState("");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [success, setSuccess] = useState("");

  const debouncedSetUserId = useMemo(
    () =>
      debounce((value: string) => {
        setCurrentPage(1);
        setUserId(value.trim());
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetUserId.cancel();
    };
  }, [debouncedSetUserId]);
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { list, total } = await getLogList({
        method: "",
        nickName: "",
        page: String(currentPage),
        path: "",
        requestTimeEnd: "",
        requestTimeStart: "",
        size: String(pageSize),
        success,
        type,
        userId,
      });
      setData(list || []);
      setTotal(total || 0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, userId, type, success]);

  useEffect(() => {
    fetchLogs().catch(console.error);
  }, [fetchLogs]);

  return (
    <Card
      className={styles.panelCard}
      bordered={false}
      title={<h2 className={styles.sectionTitle}>调用记录</h2>}
      extra={
        <Space wrap>
          <Input
            placeholder="搜索用户ID..."
            style={{ width: 180 }}
            value={userIdInput}
            onChange={(e) => {
              setUserIdInput(e.target.value);
              debouncedSetUserId(e.target.value);
            }}
          />
          <Select
            defaultValue={type}
            onChange={(e) => {
              setCurrentPage(1);
              setType(e);
            }}
            style={{ width: 120 }}
            options={[
              { value: "", label: "全部类型" },
              { value: "login", label: "登录" },
              { value: "select", label: "查询" },
              { value: "update", label: "修改" },
              { value: "delete", label: "删除" },
              { value: "save", label: "新增" },
            ]}
          />
          <Select
            defaultValue={success}
            onChange={(e) => {
              setCurrentPage(1);
              setSuccess(e);
            }}
            style={{ width: 120 }}
            options={[
              { value: "", label: "全部状态" },
              { value: "1", label: "成功" },
              { value: "0", label: "失败" },
            ]}
          />
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="requestId"
        rowClassName={() => styles.tableRow}
        scroll={{ x: "max-content" }}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (allTotal) => `共 ${allTotal} 条`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />
    </Card>
  );
};

export default CallRecordsPanel;
