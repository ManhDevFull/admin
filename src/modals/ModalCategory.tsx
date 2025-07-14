import { Form, Input, message, Modal, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import handleAPI from "../apis/handleAPI";
import { replaceName } from "../utils/replaceName";
import { ICategory } from "../models/CategoryModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  listCategory: any;
  category?: ICategory;
}
const ModelCategory = (props: Props) => {
  const { visible, onClose, listCategory, category } = props;

  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [list, setList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {

    setList(listCategory)
    if (visible && category) {
      form.setFieldsValue(category);
      const newList = deleteCategoryById(list, category._id)
      setList(newList)
    }
  }, [visible]);
const deleteCategoryById = (data: any, idToDelete: string) => {
  return data
    .filter((item:any) => item.value !== idToDelete)
    .map((item: any) => ({
      ...item,
      children: deleteCategoryById(item.children || [], idToDelete),
    }));
};
  const addCategory = async (values: any) => {
    const api = `/category/${
      category ? `update?id=${category._id}` : "add-new"
    }`;
    setIsLoading(true);
    const data: any = {};
    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.slug = replaceName(values.name);

    try {
      console.log(data)
      const res: any = await handleAPI(api, data, category ? "put" : "post");
      message.success(res.message);
      handleClode();
    } catch (error: any) {
      if(error.message === 'Categody is existing') {
        message.error('Categody is existing')
      }
      if (error.error === "jwt expired") handleRefreshToken();
    } finally {
      setIsLoading(false);
    }
  };
  const handleClode = () => {
    form.resetFields();
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
      // width={{900}}
      onCancel={handleClode}
      onClose={handleClode}
      open={visible}
      cancelText="Discard"
      okText={category ? "Update Category" : "Add New Category"}
      title={category ? "Update Category" : "Add New Category"}
      okButtonProps={{
        loading: isLoading,
      }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={addCategory}
        disabled={isLoading}
      >
        <Form.Item
          name={"name"}
          rules={[
            {
              required: true,
              message: "Please enter category name!!!",
            },
          ]}
          label={"Category name"}
        >
          <Input placeholder="Enter category name" allowClear />
        </Form.Item>
        <Form.Item name={"parentId"} label='Parent category'>
          <TreeSelect treeData={list} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModelCategory;
