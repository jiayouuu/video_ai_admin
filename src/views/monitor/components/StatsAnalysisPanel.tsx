import { Card, Col, Row, Segmented } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import { monthlyData, yearlyData } from "@/views/monitor/mockData";
import styles from "@/views/monitor/index.module.scss";
import { useAppTheme } from "@/contexts/themeContext";

type PeriodType = "月度" | "年度";
type ChartType = "bar" | "line";

interface ChartCardProps {
  title: string;
  xData: string[];
  callData: number[];
  rateData: number[];
}

const ChartCard = ({ title, xData, callData, rateData }: ChartCardProps) => {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const chartRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useAppTheme();
  const axisTextColor = currentTheme === "dark" ? "#94a3b8" : "#6b7785";
  const axisLineColor =
    currentTheme === "dark" ? "rgba(148,163,184,.25)" : "rgba(15,23,42,.2)";
  const splitLineColor =
    currentTheme === "dark" ? "rgba(148,163,184,.15)" : "rgba(15,23,42,.1)";

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      legend: {
        data: ["调用量", "成功率"],
        textStyle: { color: axisTextColor },
        top: 8,
      },
      grid: {
        left: "8%",
        right: "8%",
        bottom: "10%",
        top: 56,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: axisTextColor },
      },
      yAxis: [
        {
          type: "value",
          name: "调用量",
          nameTextStyle: { color: axisTextColor },
          axisLabel: { color: axisTextColor },
          splitLine: { lineStyle: { color: splitLineColor } },
        },
        {
          type: "value",
          name: "成功率%",
          min: 80,
          max: 100,
          nameTextStyle: { color: axisTextColor },
          axisLabel: { color: axisTextColor },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "调用量",
          type: chartType,
          data: callData,
          barWidth: "52%",
          itemStyle: { color: "#3b82f6" },
          smooth: true,
        },
        {
          name: "成功率",
          type: "line",
          yAxisIndex: 1,
          data: rateData,
          smooth: true,
          itemStyle: { color: "#10b981" },
          lineStyle: { color: "#10b981" },
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [
    xData,
    callData,
    rateData,
    chartType,
    axisTextColor,
    axisLineColor,
    splitLineColor,
  ]);

  return (
    <Card
      className={styles.panelCard}
      bordered={false}
      title={<span className={styles.sectionSubTitle}>{title}</span>}
      extra={
        <Segmented
          size="small"
          value={chartType}
          onChange={(v) => setChartType(v as ChartType)}
          options={[
            { label: "柱状图", value: "bar" },
            { label: "折线图", value: "line" },
          ]}
        />
      }
    >
      <div ref={chartRef} className={styles.statChart} />
    </Card>
  );
};

const StatsAnalysisPanel = () => {
  const [period, setPeriod] = useState<PeriodType>("月度");

  const dataset = useMemo(
    () => (period === "月度" ? monthlyData : yearlyData),
    [period],
  );

  return (
    <section>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>统计分析</h2>
        <Segmented
          value={period}
          onChange={(v) => setPeriod(v as PeriodType)}
          options={["月度", "年度"]}
        />
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <ChartCard
            title="视频接口调用统计"
            xData={dataset.xData}
            callData={dataset.videoCalls}
            rateData={dataset.videoRate}
          />
        </Col>
        <Col xs={24} xl={12}>
          <ChartCard
            title="3D接口调用统计"
            xData={dataset.xData}
            callData={dataset.calls3d}
            rateData={dataset.rate3d}
          />
        </Col>
      </Row>
    </section>
  );
};

export default StatsAnalysisPanel;
