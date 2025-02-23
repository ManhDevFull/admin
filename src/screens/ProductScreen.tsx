import { Button, message, Modal, Space, Typography } from "antd";
import { Edit2, Filter } from "iconsax-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import handleAPI from "../apis/handleAPI";
import { color, colorBox } from "../constants/color";
import { ToogleProduct } from "../modals";
import { ICategory } from "../models/CategoryModel";
import { ProductModal } from "../models/ProductModel";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const { Title } = Typography;
const { confirm } = Modal;
const ProductScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibel, setIsVisible] = useState(false);
  const [isPage, setIsPage] = useState(1);
  const [category, setCategory] = useState<any[]>([]);
  const [product, setProduct] = useState<ProductModal>();
  const [products, setProducts] = useState<ProductModal[]>([]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      await getCategory();
      await getPrduct();
      setIsLoading(false);
    };
    getData();
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
  const getPrduct = async () => {
    const api = `/product?page=${isPage}`;
    try {
      const res: any = await handleAPI(api);
      if (res.data) {
        setProducts(res.data.items);
      }
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    }
  };
  const getCategoryName = (id: string) => {
    const categoryName = category.find(
      (item: { label: string; value: string }) => item.value === id
    );
    return categoryName ? categoryName.label : "";
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
  const RemoveProduct = async (id: any) => {
    const api = `/product/delete?id=${id}`;
    try {
      const res: any = await handleAPI(api, undefined, "delete");
      message.success(res.message);
      getPrduct();
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    }
  };
  return (
    <div>
      <div
        style={{
          height: 50,
          display: "flex",
          justifyContent: "space-between",
          padding: 15,
        }}
      >
        <Title level={3}>Products</Title>
        <Space className="mt-3">
            <Button
              size="large"
              onClick={() => setIsVisible(true)}
              type="primary"
            >
              Add Product
            </Button>
            <Button size="large" icon={<Filter size={20} />}>
              Filter
            </Button>
          </Space>
      </div>
      <hr />
      {isLoading && (<Loader />)}
      <div
        style={{
          paddingLeft: 35,
          paddingRight: 35,
          paddingTop: 5,
        }}
      >
        
        {products &&
          products.map((item: ProductModal) => (
            <div className="row mt-1 box-dashed" key={item._id}>
              <div className="col-4">
                <img
                  style={{
                    borderRadius: 5,
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                  }}
                  src={item.imageUrl[0]}
                  alt={item.slug}
                />
              </div>
              <div className="col-5 mt-4">
                <div style={{ fontSize: 24, color: color.gray600 }}>
                  <Link to={`details/${item._id}`}>{item.name}</Link>
                </div>
                <div
                  style={{
                    fontSize: 19,
                    color: color.gray600,
                    marginTop: 10,
                    width: 290,
                  }}
                >
                  <div
                    className="p-m"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
                <div style={{ fontSize: 19 }}>
                  Category:
                  {item.category.map((id: string) => (
                    <Button
                      key={id}
                      type="text"
                      style={{
                        marginLeft: 5,
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
              <div className="col-3" style={{ marginTop: 80 }}>
                <Space>
                  <Button
                    style={{
                      width: 100,
                    }}
                    size="large"
                    type="primary"
                    icon={<Edit2 size={20} />}
                    onClick={() => {
                      setIsVisible(true);
                      setProduct(item);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    style={{
                      width: 100,
                    }}
                    size="large"
                    type="dashed"
                    icon={<Edit2 size={20} />}
                    onClick={() =>
                      confirm({
                        title: "Confirm",
                        content: "Are you sure you want to remove this product",
                        onOk: () => RemoveProduct(item._id),
                      })
                    }
                  >
                    Delete
                  </Button>
                </Space>
              </div>
            </div>
          ))}
      </div>
      <ToogleProduct
        onHandle={() => {
          setIsVisible(false);
          getPrduct();
        }}
        category={category}
        visible={isVisibel}
        onClose={() => {
          setIsVisible(false);
          setProduct(undefined);
        }}
        item={product}
      />
    </div>
  );
};
export default ProductScreen;
