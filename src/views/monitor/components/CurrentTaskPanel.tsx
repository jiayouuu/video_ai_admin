import { Card, Progress, Segmented, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  current3dTasks,
  currentVideoTasks,
  type CurrentTask,
} from "@/views/monitor/mockData";
import styles from "@/views/monitor/index.module.scss";

const CurrentTaskPanel = () => {
  const [taskType, setTaskType] = useState<"视频" | "3D">("视频");

  const dataSource = useMemo(
    () => (taskType === "视频" ? currentVideoTasks : current3dTasks),
    [taskType],
  );

  const columns: ColumnsType<CurrentTask> = [
    { title: "任务ID", dataIndex: "taskId", key: "taskId" },
    { title: "类型", dataIndex: "type", key: "type" },
    { title: "用户", dataIndex: "user", key: "user" },
    {
      title: "进度",
      dataIndex: "progress",
      key: "progress",
      render: (value: number) => (
        <Progress
          percent={value}
          size="small"
          showInfo={false}
          strokeColor="#3b82f6"
        />
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value: CurrentTask["status"]) => (
        <Tag color={value === "运行中" ? "processing" : "default"}>{value}</Tag>
      ),
    },
  ];

  return (
    <Card
      className={styles.panelCard}
      bordered={false}
      title={<span className={styles.sectionSubTitle}>当前正在调用的任务</span>}
      extra={
        <Segmented
          size="small"
          value={taskType}
          onChange={(v) => setTaskType(v as "视频" | "3D")}
          options={["视频", "3D"]}
        />
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        rowClassName={() => styles.tableRow}
      />
    </Card>
  );
};

export default CurrentTaskPanel;
