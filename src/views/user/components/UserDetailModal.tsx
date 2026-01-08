import { Modal, Descriptions, Image, Tag, Spin } from "antd";
import type { FC } from "react";
import type { User } from "@/types/user";
import dayjs from "dayjs";

interface UserDetailModalProps {
  open: boolean;
  onCancel: () => void;
  data?: User;
  loading?: boolean;
}

const UserDetailModal: FC<UserDetailModalProps> = ({
  open,
  onCancel,
  data,
  loading = false,
}) => {
  return (
    <Modal
      title="用户详情"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Spin spinning={loading}>
        {data && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="头像" span={2}>
              <Image
                width={100}
                src={import.meta.env.VITE_API_HOST + data.faceImage}
              />
            </Descriptions.Item>
            <Descriptions.Item label="账号">{data.username}</Descriptions.Item>
            <Descriptions.Item label="昵称">{data.nickname}</Descriptions.Item>
            <Descriptions.Item label="幼儿园" span={2}>
              {data.kindergartenName}
            </Descriptions.Item>
            <Descriptions.Item label="年级">{data.grade}</Descriptions.Item>
            <Descriptions.Item label="班级">{data.className}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={data.status === "0" ? "success" : "error"}>
                {data.status === "0" ? "正常" : "封禁"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="角色名称">
              {data.roleName}
            </Descriptions.Item>
            <Descriptions.Item label="积分">
              {data.tokenNumber} / {data.tokenTotalNumber}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Spin>
    </Modal>
  );
};

export default UserDetailModal;
