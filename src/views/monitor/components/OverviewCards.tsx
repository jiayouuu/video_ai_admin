import { Card, Col, Row } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { overviewCards } from "@/views/monitor/mockData";
import styles from "@/views/monitor/index.module.scss";

const OverviewCards = () => {
  return (
    <Row gutter={[16, 16]}>
      {overviewCards.map((item) => (
        <Col xs={24} sm={12} md={8} xl={4} key={item.title}>
          <Card className={styles.panelCard} bordered={false}>
            <div className={styles.metricTitle}>{item.title}</div>
            <Typography.Text
              className={styles.metricValue}
              ellipsis={{ tooltip: item.value }}
            >
              {item.value}
            </Typography.Text>
            <div className={styles.metricFooter}>
              <span
                className={
                  item.rateType === "down" ? styles.rateDown : styles.rateUp
                }
              >
                {item.rateType === "down" ? (
                  <ArrowDownOutlined />
                ) : (
                  <ArrowUpOutlined />
                )}{" "}
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
