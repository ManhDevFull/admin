import { Layout, Menu, MenuProps, Typography } from "antd";
import { Link } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineInventory, MdOutlineDiscount, MdOutlineCategory, MdOutlineAnalytics, MdOutlineRateReview } from "react-icons/md";
import { appInfo } from "../constants/appInfos";
import { color } from "../constants/color";
import { Box } from "iconsax-react";

const { Sider } = Layout;
const {Text}  = Typography
type MenuItem = Required<MenuProps>["items"][number];
const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: <Link to={"/"}>Dashboard</Link>,
      icon: <MdOutlineDashboard size={20} />,
    },
    {
      key: "product",
      label: <Link to={"/product"}>Product</Link>,
      icon: <MdOutlineInventory size={20} />,
    },
    {
      key: "category",
      label: <Link to={"/category"}>Category</Link>,
      icon: <MdOutlineCategory size={20} />,
    },
    {
      key: "order",
      label: <Link to={"/order"}>Order</Link>,
      icon: <Box size={20} />,
    },
    {
      key: "promotion",
      label: <Link to={"/promotion"}>Promotion</Link>,
      icon: <MdOutlineDiscount size={20} />,
    },
    {
      key: "inventory",
      label: <Link to={"/inventory"}>Inventory</Link>,
      icon: <MdOutlineInventory size={20} />,
    },
    {
      key: "report-analytic",
      label: <Link to={"/report-analytic"}>Report and Analytic</Link>,
      icon: <MdOutlineAnalytics size={20} />,
    },
    {
      key: "review-feedback",
      label: <Link to={"/review-feedback"}>Review and Feedback</Link>,
      icon: <MdOutlineRateReview size={20} />,
    },
  ];
  return (
    <Sider width={250} theme="light" style={{height: '100vh'}}>
      <div className="p-2 d-flex">
        <img
          src={appInfo.appLogo}
          alt={appInfo.title}
          width={45}
        />
        <Text style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: color.primary500,
            margin: 0,
            marginTop: 3
        }}>{appInfo.title}</Text>
      </div>
      <Menu items={items} theme="light" />
    </Sider>
  );
};
export default SiderComponent;
