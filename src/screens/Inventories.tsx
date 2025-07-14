import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { Button, Space, Table, Tooltip, Typography } from "antd";
import { Sort } from "iconsax-react";
import { ColumnProps } from "antd/es/table";
import { color } from "../constants/color";
import { MdLibraryAdd } from "react-icons/md";
const { Title, Text } = Typography;
const InventoryScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    getInventory();
  }, []);
  const getInventory = async () => {
    const api = `/inventorys`;
    try {
      const res = await handleAPI(api);
      console.log(res);
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
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
  const columns: ColumnProps<any>[] = [
    {
      key: "stt",
      title: "#",
      dataIndex: "",
      render: (_, __, index) => <Text>{(1 - 1) * 10 + index + 1}</Text>,
      width: 30,
      align: "center",
    },
    {
      key: "name",
      title: "Product Name",
      dataIndex: "",
    },
    {
      key: "category",
      title: "Categories",
      dataIndex: "",
    },
    {
      key: "size",
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "",
      render: (item: any) => (
        <Space>
          <Tooltip title='Add product'><Button
            type="text"
            icon={<MdLibraryAdd />}
            onClick={() => console.log("a")}
          /></Tooltip>
          
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={data}
        columns={columns}
        // pagination={{
        //   total: total,
        //   onChange(page1, _pageSize) {
        //       setPage(page1)
        //   },
        // }}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Orders</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button icon={<Sort size={20} color={color.gray600} />}>
                  Filters
                </Button>
                <Button>History</Button>
              </Space>
            </div>
          </div>
        )}
      />
    </div>
  );
};
export default InventoryScreen;
