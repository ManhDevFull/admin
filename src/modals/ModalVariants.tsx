import { Button, Card, Form, Input, message, Modal, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { MdAdd, MdRemove } from "react-icons/md";
import { color } from "../constants/color";
import { BsPlusSquareDotted } from "react-icons/bs";
import { uploadFile } from "../utils/uploadFile";
import handleAPI from "../apis/handleAPI";
import { VariantModel } from "../models/VariantModel";

interface Props {
  visible: boolean;
  onCancel: (data?: any, action?: string) => void;
  item?: VariantModel;
  parentId?: string 
}

const { Text } = Typography;

const ModalVariants = (props: Props) => {
  const { visible, onCancel, item, parentId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [variant, setVariant] = useState<{ label: string; value: string }[]>(
    []
  );
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [file, setFile] = useState<any[]>([]);
  const [img, setImg] = useState<any[]>([]);
  const fileRef = useRef<any>(null);
  const editorRef = useRef<any>(null);
  const [form] = Form.useForm();

  useEffect(()=>{
    if(item){
      form.setFieldsValue(item);
      setImg(item?.imgURL);
      setContent(item.description);
      setVariant(item?.variantArray)
    } else {
      setContent('')
    }
  },[item, visible])
  const createVariant = async (values: any) => {
    setIsLoading(true);
    if(variant.length === 0) {
      setIsLoading(false)
      message.error("Information variant not implemented")
      return
    }
    const api = `product/variant/${item ? `update?id=${item._id}` : 'add-new'}`;
    const content1 = editorRef.current.getContent()
    const data: any = {
        ...values,
        parentId: parentId,
        variantArray: variant,
        description: content1,
        imgURL: item?.imgURL ? [...item.imgURL] : [],
      };
    for (const i in file) {
      const a = await uploadFile(file[i]);
      data.imgURL.push(a)
    }
    setFile([])
    try {
      const res: any = await handleAPI(api, data, item ? 'put' : 'post')
      message.success(res.message)
      Cancel(res.data, res.action)
    } catch (error: any) {
      console.log(error)

    } finally {
      setIsLoading(false)
    }
  };

  const Cancel = (resData?: any, action?: any) => {
    form.resetFields()
    setVariant([])
    setFile([])
    setImg([])
    setNewLabel('')
    setNewValue('')
    if(resData){ onCancel(resData, action) }else {onCancel()};
  };

  const setArrayVariant = () => {
    const exists = variant.some((item) => item.label === newLabel);

    if (newValue && newLabel) {
      if (!exists) {
        const newItem = { label: newLabel, value: newValue };
        setVariant([...variant, newItem]);
        setNewLabel("");
        setNewValue("");
      } else {
        message.error("Label already exists. Please enter a unique label");
      }
    } else {
      message.error("Please enter both label and value in detail variant");
    }
  };

  const removeVariant = (index: number) => {
    const newVariants = variant.filter((_, i) => i !== index);
    setVariant(newVariants);
  };
  const handleSetImg = (val: any) => {
    const selectedFile = val.target.files[0];
    if (selectedFile) {
      setFile((prevFiles) => {
        const updatedFiles = [...prevFiles, selectedFile];
        const newImageUrls = updatedFiles.map((fileI) =>
          URL.createObjectURL(fileI)
        );
        setImg((_prevImg) => [...(item ? item.imgURL : []), ...newImageUrls]);
        return updatedFiles;
      });
    }
  };

  return (
    <Modal
      width={1212}
      title={item ? 'Edit Variant' :"Create Variants"}
      okButtonProps={{
        loading: isLoading,
      }}
      open={visible}
      okText={item? 'Update' : "Create"}
      cancelText={"Discard"}
      onCancel={() =>Cancel()}
      onClose={() =>Cancel()}
      onOk={() => form.submit()}
    >
      <hr />
      <Form form={form} onFinish={createVariant}>
        <div className="row">
          <div className="col-7">
            <Card title={"Description"}>
              <Editor
                disabled={isLoading}
                apiKey="6ppnt1x6rmx0uwr3zvo0vd043in5el6je7qnh43s8vrkvjmb"
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
            </Card>
          </div>
          <div className="col-5">
            <Card title={"Detail Variant"}>
              {variant.length !== 0 &&
                variant.map((item: { label: string; value: string }, index) => (
                  <div key={index} className="row box-center mt-1">
                    <Input
                      value={item.label}
                      className="col-3"
                      style={{ marginLeft: 10 }}
                    />
                    <Input
                      value={item.value}
                      className="col-7 right-aligned-input"
                      style={{ marginLeft: 10 }}
                    />
                    <Button
                      onClick={() => removeVariant(index)}
                      style={{ marginLeft: 10 }}
                      icon={<MdRemove />}
                    />
                  </div>
                ))}
              <div className="row box-center mt-1">
                <Input
                  allowClear
                  value={newLabel}
                  className="col-3"
                  style={{ marginLeft: 10 }}
                  placeholder="Label"
                  onChange={(e) => setNewLabel(e.target.value)}
                  type="text"
                />
                <Input
                  type="text"
                  allowClear
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="col-7 right-aligned-input"
                  style={{ marginLeft: 10 }}
                  placeholder="Value"
                />
                <Button
                  onClick={setArrayVariant}
                  style={{ marginLeft: 10 }}
                  icon={<MdAdd />}
                />
              </div>
            </Card>
            <Card className="mt-2" title={"Information"}>
              <Form.Item label={"Stock"} name={"stock"}>
                <Input
                  type="number"
                  disabled={item ? true : false}
                  className="right-aligned-input"
                  placeholder="Enter product stock"
                />
              </Form.Item>
              <Form.Item label={"Price"} name={"price"}>
                <Input
                  type="number"
                  className="right-aligned-input"
                  placeholder="Enter product price"
                />
              </Form.Item>
              <hr />
              <div>
                <Text style={{ color: color.primary500 }}>Image:</Text>
              </div>
              <div className="mt-2" style={{
                display: 'flex',
                 flexWrap: 'wrap'
              }}>
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
                        alt={`${item?.imgURL[index]}-${index + 1}`}
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
              </div>
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

export default ModalVariants;
