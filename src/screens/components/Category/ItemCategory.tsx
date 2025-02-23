import { Button, Modal, Space, Typography } from "antd";
import { Edit2, UserRemove } from "iconsax-react";
import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { ICategory } from "../../../models/CategoryModel";
import handleAPI from "../../../apis/handleAPI";
import { authSeleter, refreshToken } from "../../../reduxs/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  levelItem: number;
  items: any;
  onUpdate: (val: ICategory) => void;
  onRemove: (val: any)=> void;
}
const { Text } = Typography;
const {confirm} = Modal
const ItemCategory = (props: Props) => {
    const dispatch = useDispatch();
    const auth = useSelector(authSeleter);
  const [isSelect, setIsSelect] = useState(false);
  const { items, levelItem, onUpdate, onRemove } = props;
  const { value, title, children } = items;
  const vlMarginLeft =  levelItem * 35
    const Remove = async (id: string)=>{
        const api= `/category/delete?id=${id}`
        try {
        await handleAPI(api, undefined, 'delete')
        onRemove(id)
        } catch (error:any) {
          if (error.error === "jwt expired") {
            handleRefreshToken();
          }
        }
      }
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
    <div>
      <div
        key={value}
        style={{
          marginLeft: vlMarginLeft,
          display: "flex",
          height: 65,
          alignItems: "center",
          border: "1px solid #000000",
          borderRadius: 5,
          marginBottom: 3,
        }}
        className="box-line"
      >
        {children && children.length > 0 && (
          <Button
            className="custom-button"
            type="text"
            style={{
              height: 65,
              width: 35,
            }}
            icon={
              <MdNavigateNext
                style={{
                  transform: isSelect ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
                size={40}
              />
            }
            onClick={() => setIsSelect(!isSelect)}
          ></Button>
        )}
        <Text style={{ color: "#5D6679", marginLeft: 10, fontSize: 20 }}>
          {title}
        </Text>
        <Space style={{marginLeft: 'auto'}}>
          <Button
            onClick={() => onUpdate(value)}
            type="text"
            icon={<Edit2 size={15} className="text-info" />}
          />
          <Button
          onClick={()=>confirm({
            title: 'Confirm',
            content: 'Are you sure you want to remove this category',
            onOk: () => Remove(value),
          })}
            type="text"
            icon={<UserRemove size={15} className="text-danger" />}
          />
        </Space>
      </div>
      {isSelect &&
        children?.length != 0 &&
        children?.map((item: any) => (
          <ItemCategory
            onRemove={(val:any)=> onRemove(val)}
            onUpdate={(val: any) => onUpdate(val)}
            key={item.value}
            levelItem={levelItem + 1}
            items={item}
          />
        ))}
    </div>
  );
};
export default ItemCategory;
