import { Button, Card, Input, Select, Space, Table, Tag } from "antd";
import { useState } from "react";
import { callRecords, type CallRecord } from "@/views/monitor/mockData";
import type { ColumnsType } from "antd/es/table";
import styles from "@/views/monitor/index.module.scss";

const columns: ColumnsType<CallRecord> = [
  { title: "任务ID", dataIndex: "taskId", key: "taskId", minWidth: 120 },
  { title: "类型", dataIndex: "type", key: "type", minWidth: 120 },
  { title: "用户ID", dataIndex: "userId", key: "userId", minWidth: 120 },
  {
    title: "开始时间",
    dataIndex: "startTime",
    key: "startTime",
    minWidth: 180,
    align: "center",
  },
  {
    title: "耗时(ms)",
    dataIndex: "duration",
    key: "duration",
    minWidth: 120,
    align: "right",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status: CallRecord["status"]) => (
      <Tag color={status === "成功" ? "success" : "error"}>{status}</Tag>
    ),
    minWidth: 80,
    align: "center",
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Card
      className={styles.panelCard}
      bordered={false}
      title={<h2 className={styles.sectionTitle}>调用记录</h2>}
      extra={
        <Space wrap>
          <Input placeholder="搜索任务ID..." style={{ width: 180 }} />
          <Select
            defaultValue="全部类型"
            style={{ width: 120 }}
            options={[
              { value: "全部类型", label: "全部类型" },
              { value: "视频", label: "视频" },
              { value: "3D", label: "3D" },
            ]}
          />
          <Select
            defaultValue="全部状态"
            style={{ width: 120 }}
            options={[
              { value: "全部状态", label: "全部状态" },
              { value: "成功", label: "成功" },
              { value: "失败", label: "失败" },
            ]}
          />
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={callRecords}
        rowKey="key"
        rowClassName={() => styles.tableRow}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize,
          total: 12568,
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
  );
};

export default CallRecordsPanel;
