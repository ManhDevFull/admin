import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Space,
  TreeSelect,
  Typography,
} from "antd";
import { BsPlusSquareDotted } from "react-icons/bs";
import { ProductModal } from "../models/ProductModel";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import handleAPI from "../apis/handleAPI";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { replaceName } from "../utils/replaceName";
import { color } from "../constants/color";
import { uploadFile } from "../utils/uploadFile";

interface Props {
  visible: boolean;
  onClose: () => void;
  item?: ProductModal;
  onHandle: () => void;
  category: any;
}

const { Text } = Typography;

const ToogleProduct = (props: Props) => {
  const { visible, onClose, item, category, onHandle } = props;
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState<boolean>();
  const [content, setContent] = useState("");
  const editorRef = useRef<any>(null);
  const fileRef = useRef<any>(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState<any[]>([]);
  const [img, setImg] = useState<any[]>([]);
  const [treeData, setTreeData] = useState<any>([]);
  useEffect(() => {
    const data = category.length > 0 ? formatTree(category, 'parentId') : [];
    setTreeData(data);
    if (item) {
      form.setFieldsValue(item);
      setImg(item?.imageUrl);
      setActive(item.isActive);
      setContent(item.description);
    } else {
      setContent("<b><em>-->Enter description details<--</em></b>");
    }
  }, [item, visible]);
  const formatTree = (
    data: any[],
    key: string
  ): { title: string; value: string; children?: any[] }[] => {
    const items: { title: string; value: string; children?: any[] }[] = [];

    const buildTree = (
      parentId: string | ""
    ): { title: string; value: string; children?: any[] }[] => {
      return data
        .filter((item: any) => item[key] === parentId)
        .map((item: any) => ({
          title: item.label,
          value: item.value,
          children: buildTree(item.value),
        }));
    };

    items.push(...buildTree(""));
    return items;
  };
  const handleClose = () => {
    form.resetFields();
    setActive(undefined);
    setFile([]);
    setImg([]);
    onClose();
  };

  const addNewProduct = async (values: any) => {
    const content1 = editorRef.current.getContent();
    const api = `/product/${item ? `update?id=${item._id}` : "add-new"}`;
    setIsLoading(true);
    const data: any = {
      ...values,
      isActive: active !== undefined ? active : true,
      slug: replaceName(values.name),
      description: content1,
      imageUrl: item?.imageUrl ? [...item.imageUrl] : [],
    };
    for (const i in file) {
      const a = await uploadFile(file[i]);
      data.imageUrl.push(a);
    }
    setFile([]);
    try {
      const res: any = await handleAPI(api, data, item ? "put" : "post");
      message.success(res.message);
      onHandle();
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    } finally {
      setIsLoading(false);
      handleClose()
    }
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

  const handleSetImg = (val: any) => {
    const selectedFile = val.target.files[0];
    if (selectedFile) {
      setFile((prevFiles) => {
        const updatedFiles = [...prevFiles, selectedFile];
        const newImageUrls = updatedFiles.map((fileI) =>
          URL.createObjectURL(fileI)
        );
        setImg((_prevImg) => [...(item ? item.imageUrl : []), ...newImageUrls]);
        return updatedFiles;
      });
    }
  };
  const setListCate = (value: any) => {
    console.log(value)
    const listNew: string[] = [...value];
    value.forEach((id: string) => {
      const idNew: string[] = findParent(id);
      listNew.push(...idNew);
    });
    const a: string[] = Array.from(new Set(listNew));
    if (a) {
      form.setFieldsValue({ category: a });
    }
  };
  const findParent = (id: string) => {
    const partList: string[] = [];
    const newId: any = category.find((item: any) => item.value === id);
    if (newId) {
      partList.push(newId.value);
      if (newId.parentId !== "") {
        const a: string[] = findParent(newId.parentId);
        partList.push(...a);
      }
    }
    return partList;
  };

  return (
    <Modal
      width={1200}
      open={visible}
      okText={item ? "Update" : "Add"}
      onCancel={handleClose}
      cancelText="Discard"
      title={item ? "Update product" : "Add new product"}
      onOk={() => form.submit()}
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <Form
        style={{ width: "100%" }}
        form={form}
        size="middle"
        onFinish={addNewProduct}
        layout="horizontal"
      >
        <div className="row">
          <div className="col-7">
            <Form.Item
              className="prd-name prd-name1"
              name={"name"}
              label={"Product name"}
              rules={[
                {
                  required: true,
                  message: "Please enter product name",
                },
              ]}
            >
              <Input
                className="input-select"
                maxLength={120}
                showCount
                placeholder="Enter product name."
                allowClear
              />
            </Form.Item>
            <Text style={{ color: color.primary500 }}>* Description: </Text>
            <Editor
              disabled={isLoading}
              apiKey="9hzp0e9cbkqxawme8qdw2811owyz4v6od99s8r0yri1rdyk0"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={content}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div className="col-5">
            <Card>
              <Form.Item
                className="prd-name"
                name={"category"}
                label={"Category"}
              >
                <TreeSelect
                  showSearch
                  multiple
                  placeholder="Select category"
                  treeData={treeData}
                  onChange={setListCate}
                />
              </Form.Item>
              <Space>
                <Text style={{ color: color.primary500, paddingRight: 50 }}>
                  Status:{" "}
                </Text>
                <Button
                  onClick={() => setActive(true)}
                  type={active ? "primary" : "default"}
                >
                  Active
                </Button>
                <Button
                  onClick={() => setActive(false)}
                  type={active === false ? "primary" : "default"}
                >
                  Inactive
                </Button>
              </Space>
            </Card>

            <Card title="Image product" className="card-product-img mt-2">
              {img.length > 0 &&
                img.map((itemImg, index) => (
                  <div
                    key={index}
                    style={{
                      width: 100,
                      height: 100,
                      marginRight: 5,
                      marginBottom: 5,
                    }}
                  >
                    <img
                      className="img-toogle"
                      src={itemImg}
                      alt={`${item?.slug}-${index + 1}`}
                    />
                  </div>
                ))}
              {img.length < 8 && (
                <Button
                  className="img-toogle"
                  style={{
                    width: 100,
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => fileRef.current.click()}
                  type="link"
                >
                  <BsPlusSquareDotted
                    size={40}
                    color={color.gray600}
                    style={{ opacity: 0.4 }}
                  />
                </Button>
              )}
            </Card>
          </div>
        </div>
      </Form>
      <div className="d-none">
        <input
          accept="image/*"
          ref={fileRef}
          type="file"
          multiple
          onChange={(val: any) => {
            handleSetImg(val);
            val.target.value = "";
          }}
        />
      </div>
    </Modal>
  );
};

export default ToogleProduct;
