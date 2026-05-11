import { Col, Row } from "antd";
import OverviewCards from "@/views/monitor/components/OverviewCards";
import CapacityGaugeCard from "@/views/monitor/components/CapacityGaugeCard";
import CurrentTaskPanel from "@/views/monitor/components/CurrentTaskPanel";
import StatsAnalysisPanel from "@/views/monitor/components/StatsAnalysisPanel";
import CallRecordsPanel from "@/views/monitor/components/CallRecordsPanel";
import styles from "@/views/monitor/index.module.scss";

const monitorPage = () => {
  return (
    <div className={styles.pageRoot}>
      <header className={styles.pageHeader}>
        <h1>AI接口调度监控中心</h1>
        <p>实时监控视频生成与3D模型接口运行状态</p>
      </header>

      <OverviewCards />

      <Row
        gutter={[16, 16]}
        className={`${styles.sectionGap} ${styles.equalHeightRow}`}
        align="stretch"
      >
        <Col xs={24} xl={6} className={styles.equalHeightCol}>
          <CapacityGaugeCard title="视频接口实时容量" value={40} usage="2/5" />
        </Col>
        <Col xs={24} xl={12} className={styles.equalHeightCol}>
          <CurrentTaskPanel />
        </Col>
        <Col xs={24} xl={6} className={styles.equalHeightCol}>
          <CapacityGaugeCard title="3D接口实时容量" value={40} usage="2/5" />
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
