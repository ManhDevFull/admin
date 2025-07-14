import { Button, Typography } from "antd";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { ModelCategory } from "../modals";
import ItemCategory from "./components/Category/ItemCategory";
// import { SelectCate } from "../models/CategoryModel";
// import { buildCreateSlice } from "@reduxjs/toolkit";
import Loader from "../components/Loader";
interface ICategory {
  name: string;
  _id: string;
  slug?: string;
  parentId?: string; // Có thể là null nếu không có danh mục cha
  createdAt: Date;
  updatedAt: Date; // Thêm trường children để lưu danh mục con
}
const { Title, Text } = Typography;
const CategoryScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<ICategory>();
  const [list, setList] = useState<ICategory[]>([]);
  useEffect(() => {
    const getC = async () => {
      setIsLoading(true)
      await getCategory();
      setIsLoading(false)
    }
    getC()
    
  }, []);

  const formatTree = (data: any[], key: string): { title: string, value: string, children?: any[] }[] => {
    const items: { title: string; value: string; children?: any[] }[] = [];
  
    const buildTree = (parentId: string | ''): { title: string; value: string; children?: any[] }[] => {
      return data.filter((item: any) => item[key] === parentId)
      .map((item: any) => ({
          title: item.name,
          value: item._id,
          children: buildTree(item._id)
        }));
    };
  
    items.push(...buildTree(''));
    return items;
  };
  
  const getCategory = async () => {
    const api = `/category`;
    try {
      const res: any = await handleAPI(api);
      if (res.data) {
        setList(res.data);
        const data = res.data.length > 0 ? formatTree(res.data, 'parentId') : [];
        setCategories(data);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error); 
      if (error.error === "jwt expired") {
        await handleRefreshToken();
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
  const selectItem = (id: string)=> {
      const itemCate = list.find((item: any) => item._id === id)
      setCategory(itemCate)
  }
  const handleRemove = (id : string)=> {
    const items = [...list]
    const index = items.findIndex((item: ICategory)=> item._id=== id )
    if(index !== -1){
      items.splice(index, 1)
    }
    setList(items)
    const data = items.length > 0 ? formatTree(items, 'parentId') : [];
    setCategories(data);
  }
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
        <Title level={3}>Category</Title>
        <Button type="primary" size="large" onClick={() => setIsVisible(true)}>
          Add New
        </Button>
      </div>
      <hr />
      {/* content */}
      {isLoading && (<Loader />)}
      <div>
        {categories &&
          categories.map((item:any) => (
            <ItemCategory
              key={item.value}
              onUpdate={(val: any) => {
                selectItem(val)               
                setIsVisible(true);
              }}
              onRemove={(id:any)=> {
                handleRemove(id)
              }}
              levelItem={0}
              items={item}
            />
          ))}
      </div>
      <ModelCategory
        category={category}
        listCategory={categories}
        visible={isVisible}
        onClose={async() => {
          setIsVisible(false);
          setCategory(undefined);
          await getCategory()
        }}
      />
    </div>
  );
};
export default CategoryScreen;
