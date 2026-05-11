import { Col, Row } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import OverviewCards from "@/views/monitor/components/OverviewCards";
import CapacityGaugeCard from "@/views/monitor/components/CapacityGaugeCard";
import CurrentTaskPanel from "@/views/monitor/components/CurrentTaskPanel";
import StatsAnalysisPanel from "@/views/monitor/components/StatsAnalysisPanel";
import CallRecordsPanel from "@/views/monitor/components/CallRecordsPanel";
import styles from "@/views/monitor/index.module.scss";
import {
  getModelDayStats,
  getModelCallRecords,
  getVideoCallRecords,
} from "@/services/monitor";
import type { DayStatus, SemaphoreStatus } from "@/types/monitor";

const getRate = (num: number, den: number) => {
  if (!den) return "0.0%";
  return `${((num / den) * 100).toFixed(1)}%`;
};

const pickTypeStatus = (list: DayStatus[], keyword: string) => {
  return (
    list.find((item) => item.type?.toLowerCase() === keyword.toLowerCase()) ||
    list.find((item) => item.type?.toLowerCase().includes(keyword.toLowerCase()))
  );
};

const monitorPage = () => {
  const [dayStats, setDayStats] = useState<DayStatus[]>([]);
  const [videoStatus, setVideoStatus] = useState<SemaphoreStatus | null>(null);
  const [modelStatus, setModelStatus] = useState<SemaphoreStatus | null>(null);

  const fetchBaseData = useCallback(async () => {
    const today = dayjs().format("YYYY-MM-DD");
    const [stats, video, model] = await Promise.all([
      getModelDayStats(today),
      getVideoCallRecords(),
      getModelCallRecords(),
    ]);
    setDayStats(stats);
    setVideoStatus(video);
    setModelStatus(model);
  }, []);

  useEffect(() => {
    fetchBaseData().catch(console.error);
    const timer = window.setInterval(() => {
      fetchBaseData().catch(console.error);
    }, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [fetchBaseData]);

  const overviewCards = useMemo(() => {
    const video = pickTypeStatus(dayStats, "video");
    const model3d = pickTypeStatus(dayStats, "3d");
    return [
      {
        title: "今日视频调用",
        value: String(video?.total ?? 0),
        rate: getRate(video?.success ?? 0, video?.total ?? 0),
        rateType: "neutral" as const,
        desc: "成功率",
      },
      {
        title: "今日视频成功",
        value: String(video?.success ?? 0),
        rate: getRate(video?.success ?? 0, video?.total ?? 0),
        rateType: "up" as const,
        desc: "成功率",
      },
      {
        title: "今日视频失败",
        value: String(video?.fail ?? 0),
        rate: getRate(video?.fail ?? 0, video?.total ?? 0),
        rateType: "down" as const,
        desc: "失败率",
      },
      {
        title: "今日3D调用",
        value: String(model3d?.total ?? 0),
        rate: getRate(model3d?.success ?? 0, model3d?.total ?? 0),
        rateType: "neutral" as const,
        desc: "成功率",
      },
      {
        title: "今日3D成功",
        value: String(model3d?.success ?? 0),
        rate: getRate(model3d?.success ?? 0, model3d?.total ?? 0),
        rateType: "up" as const,
        desc: "成功率",
      },
      {
        title: "今日3D失败",
        value: String(model3d?.fail ?? 0),
        rate: getRate(model3d?.fail ?? 0, model3d?.total ?? 0),
        rateType: "down" as const,
        desc: "失败率",
      },
    ];
  }, [dayStats]);

  const videoUsage = `${videoStatus?.currentConcurrent ?? 0}/${videoStatus?.maxConcurrent ?? 0}`;
  const modelUsage = `${modelStatus?.currentConcurrent ?? 0}/${modelStatus?.maxConcurrent ?? 0}`;

  const videoGauge =
    videoStatus && videoStatus.maxConcurrent > 0
      ? Math.round((videoStatus.currentConcurrent / videoStatus.maxConcurrent) * 100)
      : 0;
  const modelGauge =
    modelStatus && modelStatus.maxConcurrent > 0
      ? Math.round((modelStatus.currentConcurrent / modelStatus.maxConcurrent) * 100)
      : 0;

  return (
    <div className={styles.pageRoot}>
      <header className={styles.pageHeader}>
        <h1>AI接口调度监控中心</h1>
        <p>实时监控视频生成与3D模型接口运行状态</p>
      </header>

      <OverviewCards cards={overviewCards} />

      <Row
        gutter={[16, 16]}
        className={`${styles.sectionGap} ${styles.equalHeightRow}`}
        align="stretch"
      >
        <Col xs={24} xl={6} className={styles.equalHeightCol}>
          <CapacityGaugeCard
            title="视频接口实时容量"
            value={videoGauge}
            usage={videoUsage}
          />
        </Col>
        <Col xs={24} xl={12} className={styles.equalHeightCol}>
          <CurrentTaskPanel
            videoTaskList={videoStatus?.taskList ?? []}
            modelTaskList={modelStatus?.taskList ?? []}
          />
        </Col>
        <Col xs={24} xl={6} className={styles.equalHeightCol}>
          <CapacityGaugeCard
            title="3D接口实时容量"
            value={modelGauge}
            usage={modelUsage}
          />
        </Col>
      </Row>

      <div className={styles.sectionGap}>
        <StatsAnalysisPanel />
      </div>

      <div className={styles.sectionGap}>
        <CallRecordsPanel />
      </div>
    </div>
  );
};

export default monitorPage;
