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

const getChangeRate = (today: number, yesterday: number) => {
  if (!yesterday) {
    if (!today) return "0.0%";
    return "100.0%";
  }
  return `${(((today - yesterday) / yesterday) * 100).toFixed(1)}%`;
};

const getRateTypeByChange = (today: number, yesterday: number) => {
  if (today > yesterday) return "up" as const;
  if (today < yesterday) return "down" as const;
  return "neutral" as const;
};

const pickTypeStatus = (list: DayStatus[], keyword: string) => {
  return (
    list.find((item) => item.type?.toLowerCase() === keyword.toLowerCase()) ||
    list.find((item) =>
      item.type?.toLowerCase().includes(keyword.toLowerCase()),
    )
  );
};

const monitorPage = () => {
  const [dayStats, setDayStats] = useState<DayStatus[]>([]);
  const [prevDayStats, setPrevDayStats] = useState<DayStatus[]>([]);
  const [videoStatus, setVideoStatus] = useState<SemaphoreStatus | null>(null);
  const [modelStatus, setModelStatus] = useState<SemaphoreStatus | null>(null);

  const fetchBaseData = useCallback(async () => {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const [stats, prevStats, video, model] = await Promise.all([
      getModelDayStats(today),
      getModelDayStats(yesterday),
      getVideoCallRecords(),
      getModelCallRecords(),
    ]);
    setDayStats(stats);
    setPrevDayStats(prevStats);
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
    const video = pickTypeStatus(dayStats, "video") || {
      total: 0,
      success: 0,
      fail: 0,
      progress: 0,
      type: "video",
    };
    const model3d = pickTypeStatus(dayStats, "3d") || {
      total: 0,
      success: 0,
      fail: 0,
      progress: 0,
      type: "3d",
    };
    const prevVideo = pickTypeStatus(prevDayStats, "video") || {
      total: 0,
      success: 0,
      fail: 0,
      progress: 0,
      type: "video",
    };
    const prevModel3d = pickTypeStatus(prevDayStats, "3d") || {
      total: 0,
      success: 0,
      fail: 0,
      progress: 0,
      type: "3d",
    };

    return [
      {
        title: "今日视频调用",
        value: String(video.total),
        rate: getChangeRate(video.total, prevVideo.total),
        rateType: getRateTypeByChange(video.total, prevVideo.total),
        desc: "较昨日",
        color: "",
      },
      {
        title: "今日视频成功",
        value: String(video.success),
        rate: getChangeRate(
          video.success / video.total,
          prevVideo.success / prevVideo.total,
        ),
        rateType: getRateTypeByChange(
          video.success / video.total,
          prevVideo.success / prevVideo.total,
        ),
        desc: "成功率",
        color: "rgb(16 185 129)",
      },
      {
        title: "今日视频失败",
        value: String(video.fail),
        rate: getChangeRate(
          video.fail / video.total,
          prevVideo.fail / prevVideo.total,
        ),
        rateType: getRateTypeByChange(
          video.fail / video.total,
          prevVideo.fail / prevVideo.total,
        ),
        desc: "失败率",
        color: "rgb(239 68 68)",
        type: "negative" as const,
      },
      {
        title: "今日3D调用",
        value: String(model3d.total),
        rate: getChangeRate(model3d.total, prevModel3d.total),
        rateType: getRateTypeByChange(model3d.total, prevModel3d.total),
        desc: "较昨日",
        color: "",
      },
      {
        title: "今日3D成功",
        value: String(model3d.success),
        rate: getChangeRate(
          model3d.success / video.total,
          prevModel3d.success / prevVideo.total,
        ),
        rateType: getRateTypeByChange(
          model3d.success / video.total,
          prevModel3d.success / prevVideo.total,
        ),
        desc: "成功率",
        color: "rgb(16 185 129)",
      },
      {
        title: "今日3D失败",
        value: String(model3d.fail),
        rate: getChangeRate(
          model3d.fail / video.total,
          prevModel3d.fail / prevVideo.total,
        ),
        rateType: getRateTypeByChange(
          model3d.fail / video.total,
          prevModel3d.fail / prevVideo.total,
        ),
        desc: "失败率",
        color: "rgb(239 68 68)",
        type: "negative" as const,
      },
    ];
  }, [dayStats, prevDayStats]);

  const videoUsage = `${videoStatus?.currentConcurrent ?? 0}/${videoStatus?.maxConcurrent ?? 0}`;
  const modelUsage = `${modelStatus?.currentConcurrent ?? 0}/${modelStatus?.maxConcurrent ?? 0}`;

  const videoGauge =
    videoStatus && videoStatus.maxConcurrent > 0
      ? Math.round(
          (videoStatus.currentConcurrent / videoStatus.maxConcurrent) * 100,
        )
      : 0;
  const modelGauge =
    modelStatus && modelStatus.maxConcurrent > 0
      ? Math.round(
          (modelStatus.currentConcurrent / modelStatus.maxConcurrent) * 100,
        )
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
