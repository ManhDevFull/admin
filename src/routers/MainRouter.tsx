import { Affix, Layout } from "antd";
import HomeScreen from "../screens/HomeScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  InventoryScreen,
  OrdersScreen,
  ProductDelailScreen,
  ProductScreen,
  SuppliersScreen,
} from "../screens";
import { HeaderComponent, SiderComponent } from "../components";
import CategoryScreen from "../screens/CategoryScreen";

const { Content } = Layout;
const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content
            className="mb-1 mt-3 container bg-white"
            style={{
              borderRadius: 5,
            }}
          >
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product" element={<ProductScreen />} />
              <Route path="/product/details/:id" element={<ProductDelailScreen />} />
              <Route path="/category" element={<CategoryScreen />} />
              <Route path="/order" element={<OrdersScreen />} />
              <Route path="/promotion" element={<SuppliersScreen />} />
              <Route path="/inventory" element={<InventoryScreen />} />
              <Route path="/report-analytic" element={<ProductScreen />} />
              <Route path="/review-feedback" element={<ProductScreen />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
