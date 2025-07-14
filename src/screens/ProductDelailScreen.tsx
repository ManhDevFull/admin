import {
  Image,
  Button,
  Card,
  Typography,
  Tooltip,
  Space,
  message,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import handleAPI from "../apis/handleAPI";
import { BsTrash3 } from "react-icons/bs";
import { MdLibraryAdd } from "react-icons/md";
import { color, colorBox } from "../constants/color";
import { ProductModal } from "../models/ProductModel";
import { Edit2 } from "iconsax-react";
import { ICategory } from "../models/CategoryModel";
import { useDispatch, useSelector } from "react-redux";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import ModalVariants from "../modals/ModalVariants";
import { VariantItem, VariantModel } from "../models/VariantModel";
const { Text, Title } = Typography;
const { confirm } = Modal;
const ProductDelailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [visible, setVisible] = useState(false);
  const [listVariant, setListVariant] = useState<VariantModel[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [product, setProduct] = useState<ProductModal>();
  const [content, setContent] = useState("");
  const [editDesc, setEditDesc] = useState(false);
  const [variant, setVariant] = useState<VariantModel>();
  useEffect(() => {
    getData();
    getCategory();
  }, []);
  const getCategory = async () => {
    const api1 = `/category`;
    try {
      const res: any = await handleAPI(api1);
      if (res.data) {
        setCategory(
          res.data.map((item: ICategory) => ({
            label: item.name,
            value: item._id,
            parentId: item.parentId,
          }))
        );
      }
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
        getCategory();
      }
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
  const getData = async () => {
    const api = `/product/detail?id=${id}`;
    const res = await handleAPI(api);
    res.data && setProduct(res.data.item);
    res.data && setListVariant(res.data.variants);
    res.data && setContent(res.data.item.description);
  };
  const getCategoryName = (id: string) => {
    const categoryName = category.find(
      (item: { label: string; value: string }) => item.value === id
    );
    return categoryName ? categoryName.label : "";
  };
  const RemoveVariant = async (id: string) => {
    const api = `product/variant/delete?id=${id}`;
    try {
      const res: any = await handleAPI(api, undefined, "delete");
      if (res.action === "delete") {
        message.success("Deleted variant product");
        const a: VariantModel[] = listVariant.filter(
          (item: VariantModel) => item._id !== id
        );
        setListVariant([...a]);
      }
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    }
  };
  return (
    <div className="p-2">
      <Title level={3}>Product: {product?.name}</Title>
      <div className="row">
        <div className="col-7">
          <Card
            title={
              <>
                <Text style={{ fontSize: 18 }}>Description</Text>
                <Button
                  icon={<Edit2 size={15} className="text-info" />}
                  style={{
                    float: "right",
                  }}
                  onClick={() => setEditDesc(!editDesc)}
                  type="primary"
                >
                  {editDesc ? "Save" : "Edit"}
                </Button>
              </>
            }
          >
            <div
              className="p-m"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Card>
        </div>
        <div className="col-5">
          <Card title="Detail">
            <div>
              <Text>Category:</Text>
              <div
                style={{
                  float: "right",
                }}
              >
                {product?.category.map((id: string) => (
                  <Button
                    key={id}
                    type="text"
                    style={{
                      marginLeft: 5,
                      marginTop: 5,
                      border: `1px solid rgba(${
                        colorBox[Math.floor(Math.random() * colorBox.length)]
                      },0.6)`,
                    }}
                  >
                    {getCategoryName(id)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Text>Status:</Text>
              {product?.isActive ? (
                <Button
                  type="text"
                  style={{
                    border: `1px solid blue`,
                    float: "right",
                  }}
                >
                  Avtive
                </Button>
              ) : (
                <Button
                  type="text"
                  style={{
                    border: `1px solid red`,
                    float: "right",
                  }}
                >
                  Inactive
                </Button>
              )}
            </div>
            <hr className="mt-4" />
            <div>
              <Text style={{ color: color.primary500 }}>Image:</Text>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 5 }}>
              {product?.imageUrl.length !== 0 &&
                product?.imageUrl.map((url: string) => (
                  <div key={url} style={{ marginTop: 5, marginRight: 5 }}>
                    <Image
                      width={100}
                      height={100}
                      className="img-toogle"
                      src={url}
                    />
                  </div>
                ))}
            </div>
          </Card>
          <Card
            className="mt-2"
            title={
              <>
                <Text>Product Variants</Text>
                <Button
                  style={{ float: "right" }}
                  type="primary"
                  icon={<MdLibraryAdd />}
                  onClick={() => setVisible(true)}
                />
              </>
            }
          >
            {listVariant.length > 0 ? (
              listVariant.map((item: VariantModel, index) => (
                <>
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Tooltip
                      title={
                        <>
                          {item.variantArray?.map(
                            (itemS: VariantItem, index) => (
                              <div key={index}>
                                {itemS.label}: {itemS.value}
                              </div>
                            )
                          )}
                        </>
                      }
                    >
                      <Text>
                        {product?.name} {index + 1}
                      </Text>
                    </Tooltip>
                    <Space>
                      <Button
                        onClick={() => {
                          setVisible(true);
                          setVariant(item);
                        }}
                        icon={<Edit2 size={16} />}
                      />
                      <Button
                        danger
                        icon={<BsTrash3 />}
                        onClick={() =>
                          confirm({
                            title: "Confirm",
                            content:
                              "Are you sure you want to remove this product",
                            onOk: () => RemoveVariant(item._id),
                          })
                        }
                      />
                    </Space>
                  </div>{" "}
                  {index !== listVariant.length - 1 && <hr />}
                </>
              ))
            ) : (
              <Text>No variants available</Text>
            )}
          </Card>
        </div>
      </div>
      <ModalVariants
        parentId={product?._id}
        onCancel={(data?: any, action?: string) => {
          setVisible(false);
          if (action === "add") {
            const a: any = listVariant;
            setListVariant([...a, data]);
          }
          if (action === "update") {
            const index = listVariant.findIndex(
              (item: VariantModel) => item._id === data._id
            );
            if (index !== -1) {
              const a: VariantModel[] = listVariant.map(
                (item: VariantModel, i) => (i === index ? data : item)
              );
              setListVariant([...a]);
            }
          }
          setVariant(undefined);
        }}
        item={variant}
        visible={visible}
      />
    </div>
  );
};
export default ProductDelailScreen;
