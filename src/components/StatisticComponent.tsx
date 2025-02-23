import { Card, Space, Typography } from "antd";
import { ReactNode } from "react";
import { color } from "../constants/color";
import { StatisticModel } from "../models/StatisticModel";
import { MdCurrencyRupee } from "react-icons/md";
import { FormatCurrency } from "../utils/formatNumber";

interface Props {
  title: string;
  data: StatisticModel[];
}
const { Title, Text } = Typography;
const StatisticComponent = (props: Props) => {
  const { data, title } = props;
  const renderDescriptionData = (item: StatisticModel) => (
    <>
      <Title
        style={{
          fontWeight: 600,
        }}
        className="m-0"
        level={5}
      >
        {item.valueType === "number"
          ? item.value.toLocaleString()
          : FormatCurrency.VND.format(item.value)}
      </Title>
      <Text style={{ color: color.gray600, fontWeight: 500 }}>
        {item.description}
      </Text>
    </>
  );
  return (
    <Card className="mt-3">
      <Title
        level={3}
        style={{
          color: color.gray600,
        }}
      >
        {title}{" "}
      </Title>
      <div className="row">
        {data.map((item: StatisticModel, index) => (
          <div
            key={item.key}
            style={{
              borderRight: `${index < data.length - 1 ? 1 : 0}px solid #e0e0e0`,
            }}
            className="col"
          >
            <div className=" icon-wapper text-center ">{item.icon}</div>
            {!item.type || item.type === "horizontal" ? (
              <Space
                className="mt-2"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {renderDescriptionData(item)}
              </Space>
            ) : (
              <div className="text-center">{renderDescriptionData(item)}</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
export default StatisticComponent;
