import { useDispatch, useSelector } from "react-redux";
import { authSeleter, refreshToken } from "../reduxs/reducers/authReducer";
import handleAPI from "../apis/handleAPI";
import StatisticComponent from "../components/StatisticComponent";
import { StatisticModel } from "../models/StatisticModel";
import { LiaCoinsSolid } from "react-icons/lia";
import { color } from "../constants/color";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authSeleter)
const salesDate: StatisticModel[] = [
  {
    key: 'sales',
    description: 'Sales',
    color: '',
    icon: <LiaCoinsSolid size={32} color={color.primary500} />,
    value: Math.floor(Math.random()*  1000000),
    valueType: 'curency'
  },
  {
    key: 'revenue',
    description: 'Revenue',
    color: '',
    icon: <LiaCoinsSolid size={32} color={color.primary500} />,
    value: Math.floor(Math.random()*  1000000),
    valueType: 'curency'
  },
  {
    key: 'profit',
    description: 'Profit',
    color: '',
    icon: <LiaCoinsSolid size={32} color={color.primary500} /> ,
    value: Math.floor(Math.random()*  1000000),
    valueType: 'curency'
  },
  {
    key: 'cost',
    description: 'Cost',
    color: '',
    icon: <LiaCoinsSolid size={32} color={color.primary500} />,
    value: Math.floor(Math.random()* 1000000),
    valueType: 'curency'
  },
]
const inventoryData: StatisticModel[] = [
  {
    key: 'sales',
    description: 'Sales',
    color: '',
    icon: <LiaCoinsSolid size={32} color={color.primary500} />,
    value: Math.floor(Math.random()*  1000000),
    valueType: 'curency',
    type: 'vertical'
  },
  {
    key: 'revenue',
    description: 'Revenue',
    color: '',
    icon: <LiaCoinsSolid size={32} color={color.primary500} />,
    value: Math.floor(Math.random()*  1000000),
    valueType: 'curency',
    type: 'vertical'
  },
] 
  const handleRefreshToken = async ()=>{
    const api = `/auth/refresh-token?id=${auth._id}`
    try {
      const res = await handleAPI(api)
      dispatch(refreshToken(res.data))
    } catch (error: any) {
    }
  }
  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <StatisticComponent data={salesDate} title='Sales Overview' />
          <StatisticComponent data={salesDate} title='Purchase Overview' />
        </div>
        <div className="col-md-4">
          <StatisticComponent data={inventoryData} title='Inventory Summary' />
          <StatisticComponent data={inventoryData} title='Product Summary' />
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
