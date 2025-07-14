import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Typography,
} from "antd";
import { User } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { color } from "../constants/color";
import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { SupplierModel } from "../models/SupplierModel";
import { useDispatch, useSelector } from "react-redux";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";

const { Paragraph } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: SupplierModel) => void;
  supplier?: SupplierModel;
}
const ToogleSupplier = (props: Props) => {
  const { visible, onAddNew, onClose, supplier } = props;
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [file, setFile] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const inpRef = useRef<any>();
  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
      setIsTaking(supplier.isTaking === 1);
    }
  }, [supplier]);
  const addNewSupplier = async (values: any) => {
    setIsLoading(true);
    const api = `/suppliers/${
      supplier ? `update?id=${supplier._id}` : "add-new"
    }`;
    const data: any = {};
    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.price = values.price ? parseInt(values.price) : 0;
    data.isTaking = isTaking ? 1 : 0;
    if (file) {
      data.photoURL = await uploadFile(file);
    }
    data.slug = replaceName(values.name);
    
    try {
      const res: any = await handleAPI(api, data, supplier ? "put" : "post");
      !supplier && onAddNew(res.data);
      message.success(res.message);
      handleClose();
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    setIsTaking(undefined);
    onClose();
  };
  const handleRefreshToken = async () => {
    const api = `/auth/refresh-token?id=${auth._id}`;
    try {
      const res = await handleAPI(api);
      dispatch(refreshToken(res.data));
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      title={supplier ? "Update supplier" : "Add supplier"}
      cancelText="Discard"
      okText={supplier ? "Update" : "Add supplier"}
      okButtonProps={{
        loading: isLoading,
      }}
      onOk={() => form.submit()}
    >
      <label htmlFor="inpFile" className="p-2 mb-3 box-center">
        {file ? (
          <Avatar size={100} src={URL.createObjectURL(file)} />
        ) : supplier ? (
          <Avatar size={100} src={supplier.photoURL} />
        ) : (
          <Avatar
            size={100}
            style={{ backgroundColor: "white", border: "1px dashed #e0e0e0" }}
          >
            <User size={60} color={color.gray600} />
          </Avatar>
        )}

        <div
          className="ml-3"
          style={{
            marginLeft: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paragraph className="text-muted m-0">Drag image here</Paragraph>
          <Paragraph className="text-muted mt-2">Or</Paragraph>
          <Button
            style={{ marginTop: "-15px" }}
            onClick={() => inpRef.current.click()}
            type="link"
          >
            Browse image
          </Button>
        </div>
      </label>
          <Form
        disabled={isLoading}
        onFinish={addNewSupplier}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        size="large"
      >
         <Form.Item
          name={"name"}
          rules={[
            {
              required: true,
              message: "Please enter supplier name!!!",
            },
          ]}
          label="Supplier name"
        >
          <Input placeholder="Enter supplier name" allowClear />
        </Form.Item>
        <Form.Item name={"product"} label="Product">
          <Input placeholder="Enter product" allowClear />
        </Form.Item>
        <Form.Item name={"parentId"} label="Category">
          <Select options={[]} placeholder="Select product category" />
        </Form.Item>
        <Form.Item name={"price"} label="Buying Price">
          <Input placeholder="Enter buying price" type="number" allowClear />
        </Form.Item>
        <Form.Item name={"contact"} label="Contact Number">
          <Input
            placeholder="Enter supplier contact number"
            type="number"
            allowClear
          />
        </Form.Item>
        <Form.Item name={"email"} label="Email">
          <Input
            placeholder="Enter supplier contact email"
            allowClear
            type="email"
          />
        </Form.Item>
        <Form.Item label="Type">
          <div className="mb-2">
            <Button
              size="middle"
              onClick={() => setIsTaking(false)}
              type={isTaking === false ? "primary" : "default"}
            >
              Not taking return
            </Button>
          </div>
          <Button
            size="middle"
            onClick={() => setIsTaking(true)}
            type={isTaking ? "primary" : "default"}
          >
            Taking return
          </Button>
        </Form.Item>
      </Form>
      
      <div className="d-none">
        <input
          accept="image/*"
          ref={inpRef}
          type="file"
          name=""
          id="inpFile"
          onChange={(val: any) => setFile(val.target.files[0])}
        />
      </div>
    </Modal>
  );
};
export default ToogleSupplier;
