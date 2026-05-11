import { Card, Segmented, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import type { TaskList } from "@/types/monitor";
import styles from "@/views/monitor/index.module.scss";

interface CurrentTaskPanelProps {
  videoTaskList: TaskList[];
  modelTaskList: TaskList[];
}

type TaskRow = {
  key: string;
  userId: string;
  username: string;
  startTime: string;
  elapsedTime: number;
};

const CurrentTaskPanel = ({
  videoTaskList,
  modelTaskList,
}: CurrentTaskPanelProps) => {
  const [taskType, setTaskType] = useState<"视频" | "3D">("视频");

  const dataSource = useMemo<TaskRow[]>(() => {
    const list = taskType === "视频" ? videoTaskList : modelTaskList;
    return list.map((item, index) => ({
      key: `${taskType}-${index}`,
      userId: item.userId || "--",
      username: item.username || "--",
      startTime: item.startTime || "--",
      elapsedTime: item.elapsedTime ?? 0,
    }));
  }, [taskType, videoTaskList, modelTaskList]);

  const columns: ColumnsType<TaskRow> = [
    { title: "用户ID", dataIndex: "userId", key: "userId" },
    { title: "用户", dataIndex: "username", key: "username" },
    { title: "开始时间", dataIndex: "startTime", key: "startTime" },
    {
      title: "耗时(ms)",
      dataIndex: "elapsedTime",
      key: "elapsedTime",
      align: "right",
    },
    {
      title: "状态",
      key: "status",
      render: () => <Tag color="processing">运行中</Tag>,
      align: "center",
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
        locale={{ emptyText: "暂无任务" }}
      />
    </Card>
  );
};

export default CurrentTaskPanel;
