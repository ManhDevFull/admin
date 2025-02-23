import { Avatar, Button, message, Modal, Space, Table, Tooltip, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import { Edit2, Sort, UserRemove } from "iconsax-react";
import { color } from "../constants/color";
import { useEffect, useState } from "react";
import { ToogleSupplier } from "../modals";
import { SupplierModel } from "../models/SupplierModel";
import handleAPI from "../apis/handleAPI";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
const { Title, Text } = Typography;
const {confirm} = Modal
const SuppliersScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState<number>(10)
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "stt",
      title: "STT",
      dataIndex: "",
      render:(_,__, index)=>(
       <Text>
        {(page-1)*10+ index + 1}
       </Text>
      ),
      width: 65
    },
    {
      key: "name",
      title: "Supplier name",
      dataIndex: "name",
      width: 280
    },
    {
      key: "product",
      title: "Product",
      dataIndex: "product",
      width: 200
    },
    {
      key: "contact",
      title: "Contact",
      dataIndex: "contact",
      width: 150
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      render:(email)=>( <Tooltip title={email}>
        <div style={{
          maxWidth: 250,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}>
          {email}
        </div>
      </Tooltip>),
      width: 250
    },
    {
      key: "type",
      title: "Type",
      dataIndex: "isTaking",
      render: (isTaking) => (
        <Text type={isTaking ? "success" : "danger"}>
          {isTaking ? "Taking return" : "Not taking return"}
        </Text>
      ),
      width: 150
    },
    {
      key: "buttonContainer",
      title: "Action",
      dataIndex: "",
      render: (item: SupplierModel) => (
        <Space>
          <Button
            type="text"
            onClick={()=>{
            setSupplierSelected(item)
            setIsVisible(true)
            }}
            icon={<Edit2 size={15} className="text-info" />}
          />
          <Button
          onClick={()=>confirm({
            title: 'Confirm',
            content: 'Are you sure you want to remove this supplier',
            onOk: () => Remove(item._id),
          })}
            type="text"
            icon={<UserRemove size={15} className="text-danger" />}
          />
        </Space>
      ),
      fixed: "right",
      align: "right",
    },
  ];
  useEffect(() => {
   !isVisible && getSuppliers();
   getSuppliers();
  }, [page, isVisible]);
  const getSuppliers = async () => {
    const api = `/suppliers?page=${page}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      res.data && setSuppliers(res.data.items);
      res.data && setTotal(res.data.total);
    } catch (error: any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefreshToken = async () => {
    const api = `/auth/refresh-token?id=${auth._id}`;
    try {
      const res = await handleAPI(api);
      console.log(res);
      dispatch(refreshToken(res.data));
    } catch (error: any) {
      console.log(error);
    }
  };
  const Remove = async (id: String)=>{
    const api= `/suppliers/delete?id=${id}`
    try {
    await handleAPI(api, undefined, 'delete')
    getSuppliers()
    } catch (error:any) {
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    }
  }
  return (
    <div>
      <Table
      pagination={{
        total: total,
        onChange(page1, _pageSize) {
            setPage(page1)
        },
      }}
      scroll={{
      y: 'calc(100vh - 315px)'
      }}
      
        loading={isLoading}
        dataSource={suppliers}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Suppliers</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button type="primary" onClick={() => setIsVisible(true)}>
                  Add Supplier
                </Button>
                <Button icon={<Sort size={20} color={color.gray600} />}>
                  Filters
                </Button>
                <Button>Download all</Button>
              </Space>
            </div>
          </div>
        )}
      />
      <ToogleSupplier
        visible={isVisible}
        onClose={() =>{ setIsVisible(false)
          setSupplierSelected(undefined)
        }}
        onAddNew={(val) => setSuppliers([...suppliers, val])}
        supplier={supplierSelected}
      />
    </div>
  );
};
export default SuppliersScreen;
