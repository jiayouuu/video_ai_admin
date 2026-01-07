import { useRef, useState } from "react";
import { Modal, Slider, Button } from "antd";
import AvatarEditor from "react-avatar-editor";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { message } from "@/bridges/messageBridge";
import { updateFaceImage } from "@/services/user";

interface AvatarModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  userId: string;
  image: string | File;
}

const AvatarModal = ({
  open,
  onCancel,
  onSuccess,
  userId,
  image,
}: AvatarModalProps) => {
  const [scale, setScale] = useState<number>(1.4);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<AvatarEditor>(null);

  const handleSave = async () => {
    if (!editorRef.current) return;
    if (!image) {
      message.warning("请先选择图片");
      return;
    }
    setLoading(true);
    try {
      // 获取裁剪后的图片 canvas
      const canvas = editorRef.current.getImageScaledToCanvas();

      // 将 canvas 转换为 blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "avatar.png", { type: "image/png" });
          try {
            await updateFaceImage({ userId, file });
            message.success("头像上传成功");
            onSuccess();
            onCancel();
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
          message.error("图片处理失败");
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      message.error("处理图片出错");
    }
  };

  const handleClose = () => {
    setScale(1.2);
    onCancel();
  };

  return (
    <Modal
      title="修改头像"
      open={open}
      onCancel={handleClose}
      destroyOnHidden={true}
      maskClosable={false}
      width={400}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSave}
          disabled={!image}
        >
          保存
        </Button>,
      ]}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <AvatarEditor
          ref={editorRef}
          image={image}
          width={350}
          height={350}
          border={0}
          borderRadius={175} // Circular
          color={[0, 0, 0, 0.6]} // RGBA
          scale={scale}
          rotate={0}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <ZoomOutOutlined
          style={{ color: "#999" }}
          onClick={() =>
            scale - 0.1 > 1 ? setScale(scale - 0.1) : setScale(1)
          }
        />
        <Slider
          min={1}
          max={3}
          step={0.01}
          value={scale}
          onChange={(value) => setScale(value)}
          style={{ flex: 1 }}
        />
        <ZoomInOutlined
          style={{ color: "#999" }}
          onClick={() =>
            scale + 0.1 < 3 ? setScale(scale + 0.1) : setScale(3)
          }
        />
      </div>
      {/* </>
      )} */}
    </Modal>
  );
};

export default AvatarModal;
