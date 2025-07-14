import { Avatar, Button, Dropdown, Input, MenuProps, message, Space } from "antd";
import { Notification, SearchNormal } from "iconsax-react";
import { color } from "../constants/color";
import { useDispatch, useSelector } from "react-redux";
import { authSeleter, removeAuth } from "../reduxs/reducers/authReducer";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";


const HeaderComponent = () => {
  const auth1 = useSelector(authSeleter)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const items: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Log Out',
      onClick: async ()=>{
        auth.signOut()
        dispatch(removeAuth({}))
        localStorage.clear()
        navigate('/')
      },

    }
  ]
  return (
    <div className="p-2 row bg-white">
      <div className="col">
        <Input
          placeholder="Search..."
          style={{
            width: '50%',
            borderRadius: 100,
          }}
          size="large"
    
          prefix={<SearchNormal className="text-muted" size={20} />}
        />
      </div>
      <div className="col text-right">
        <Space>
            <Button type='text' icon={<Notification size={23} color={color.gray600} />} />
           <Dropdown menu={{items}} >
             <Avatar src={auth1.photoURL} size={40} />
           </Dropdown>
        </Space>
      </div>
    </div>
  );
};
export default HeaderComponent;
