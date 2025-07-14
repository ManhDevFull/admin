import { useEffect, useState } from "react"
import handleAPI from "../apis/handleAPI"
import { useDispatch, useSelector } from "react-redux"
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer"
import { Button, Space, Table, Tooltip, Typography } from "antd"
import { ColumnProps } from "antd/es/table"
import { Sort } from "iconsax-react"
import { color } from "../constants/color"
import { OrderModal } from "../models/OrderModal"
const { Title, Text } = Typography;
const OrdersScreen = () =>{

    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState<number>(10)
    const [orders, setOrders] = useState<OrderModal[]>([])
    

    const columns: ColumnProps<OrderModal>[] = [
      {
        key:'stt',
        title: '#',
        dataIndex: '',
        render:(_,__, index)=>(
          <Text>
           {(page-1)*10+ index + 1}
          </Text>
         ),
         width: 30,
         align: 'center'
      },
        {
            key: 'product',
            title: 'Products ID',
            dataIndex: 'orderNumber',
            width: 110
        },
        {
          key: 'address',
          title: 'Address',
          dataIndex: 'address',
          width: 185
        },
        {
          key: 'amount',
          title: 'Amount',
          dataIndex: 'totalAmount',
          render: (val)=>(<Text>{val} VND</Text>),
          width: 50,
          align: 'center'
        },
        {
          key: 'orderDate',
          title: 'Order Date',
          dataIndex: 'orderDate',
          render: (val)=>(<Text>{val}</Text>),
          width: 100,
          align: 'center'
        },
        {
          key: 'deliveryDate',
          title: 'Delivery Date',
          dataIndex: 'deliveryDate',
          render: (val)=>(<Text>{val ? val : '___'}</Text>),
          width: 100,
          align: 'center'
        },
        {
          key: 'note',
          title: 'Note',
          dataIndex: 'notes',
          render: (val)=>(<Tooltip title={val}>
            <div style={{
          maxWidth: 75,
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden'}}>{val? val : "Not notes"}</div>
            </Tooltip>),
          width: 75,
          align: 'center'
        },
        {
          key: 'status',
          title: 'Status',
          dataIndex: 'status',
          width: 50,
          align: 'center'
        },
    ]
    const auth = useSelector(authSeleter)
    useEffect(()=>{
        getOrder()
    },[])
    const getOrder = async ()=>{
        const api = `/orders?page=${page}`
        setIsLoading(true)
        try {
          const res = await handleAPI(api)
          res.data && setOrders(res.data.items)
          res.data && setTotal(res.data.total)
        } catch (error: any) {
            if (error.error === "jwt expired") {
                handleRefreshToken()
              }
        } finally{
            setIsLoading(false)
        }
    }
    const handleRefreshToken = async ()=>{
        const api = `/auth/refresh-token?id=${auth._id}`
        try {
          const res = await handleAPI(api)
          dispatch(refreshToken(res.data))
        } catch (error: any) {
          console.log(error)
        }
      }
    return (
        <div>
      <Table
        loading={isLoading}
        dataSource={orders}
        columns={columns}
        pagination={{
          total: total,
          onChange(page1, _pageSize) {
              setPage(page1)
          },
        }}
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
    )
}
export default OrdersScreen