import { Card, Col, Row, Typography } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import styles from "@/views/monitor/index.module.scss";

export type OverviewCardData = {
  title: string;
  value: string;
  rate: string;
  rateType: "up" | "down" | "neutral";
  desc: string;
  color: string;
  type?: "positive" | "negative";
};

interface OverviewCardsProps {
  cards: OverviewCardData[];
}

const OverviewCards = ({ cards }: OverviewCardsProps) => {
  return (
    <Row gutter={[16, 16]}>
      {cards.map((item) => (
        <Col xs={24} sm={12} md={8} xl={4} key={item.title}>
          <Card className={styles.panelCard} bordered={false}>
            <div className={styles.metricTitle}>{item.title}</div>
            <Typography.Text
              className={styles.metricValue}
              ellipsis={{ tooltip: item.value }}
              style={{ color: item.color }}
            >
              {item.value}
            </Typography.Text>
            <div className={styles.metricFooter}>
              <span
                className={(() => {
                  if (item.rateType === "down")
                    return item.type === "negative"
                      ? styles.rateUp
                      : styles.rateDown;
                  if (item.rateType === "up")
                    return item.type === "negative"
                      ? styles.rateDown
                      : styles.rateUp;
                  return styles.metricDesc;
                })()}
              >
                {item.rateType === "down" ? (
                  <ArrowDownOutlined />
                ) : item.rateType === "up" ? (
                  <ArrowUpOutlined />
                ) : null}{" "}
                {item.rate}
              </span>
              <span className={styles.metricDesc}>{item.desc}</span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default OverviewCards;
