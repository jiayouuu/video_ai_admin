import { type FC } from "react";
import { Result, Button, Typography, Space } from "antd";
import { HomeOutlined, RollbackOutlined } from "@ant-design/icons";
const { Paragraph, Title } = Typography;

const Funny404: FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-(--app-bg-404-from) to-(--app-bg-404-to) px-5 py-10">
      <Result
        status="404"
        title={
          <Title className="mb-2 text-[22px] font-bold sm:text-3xl" level={2}>
            哎呀！页面不见了
          </Title>
        }
        subTitle={
          <Paragraph className="mb-5 max-w-130 text-(--app-text-secondary)">
            可能是路由走丢了，也可能是页面偷偷溜去度假。
          </Paragraph>
        }
        extra={
          <>
            <Space className="mt-4">
              <Button
                type="primary"
                className="h-9.5 rounded-lg"
                icon={<HomeOutlined />}
                onClick={() => (window.location.href = "/")}
              >
                回到首页
              </Button>

              <Button
                className="h-9.5 rounded-lg"
                icon={<RollbackOutlined />}
                onClick={() => window.history.back()}
              >
                返回上一页
              </Button>
            </Space>
          </>
        }
      />

      <div className="mt-7 text-[13px] text-(--app-text-tertiary)">
        如果你是开发者：检查路由、静态资源和后端接口。别把 console.log
        当成魔法。
      </div>
    </div>
  );
};

export default Funny404;
