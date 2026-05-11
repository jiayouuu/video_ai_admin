import { Card } from "antd";
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import styles from "@/views/monitor/index.module.scss";
import { useAppTheme } from "@/contexts/themeContext";

interface CapacityGaugeCardProps {
  title: string;
  value: number;
  usage: string;
}

const CapacityGaugeCard = ({ title, value, usage }: CapacityGaugeCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useAppTheme();

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: {
            show: true,
            roundCap: true,
            itemStyle: { color: "#3b82f6" },
          },
          axisLine: {
            lineStyle: {
              width: 18,
              color: [
                [
                  1,
                  currentTheme === "dark"
                    ? "rgba(148,163,184,0.2)"
                    : "rgba(15,23,42,0.15)",
                ],
              ],
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          title: { show: false },
          detail: {
            formatter: "{value}%",
            color: currentTheme === "dark" ? "#f8fafc" : "#0f172a",
            fontSize: 24,
            offsetCenter: [0, 0],
          },
          data: [{ value }],
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [value, currentTheme]);

  return (
    <Card className={styles.panelCard} bordered={false}>
      <h3 className={styles.sectionSubTitle}>{title}</h3>
      <div ref={chartRef} className={styles.gaugeChart} />
      <p className={styles.gaugeUsage}>
        当前使用 <span>{usage}</span>
      </p>
    </Card>
  );
};

export default CapacityGaugeCard;
