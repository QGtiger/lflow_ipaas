import {
  ClusterOutlined,
  ContactsOutlined,
  DribbbleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import type { GetProp, MenuProps } from "antd";
import { ManagerModel } from "../model";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = GetProp<MenuProps, "items">[number];

const MyMenu: React.FC = () => {
  const {
    connectorCode,
    connectorVersionInfo: { actions },
  } = ManagerModel.useModel();
  const nav = useNavigate();
  const pathname = useLocation().pathname;
  const items: MenuItem[] = [
    {
      key: `/manager/${connectorCode}/base`,
      icon: <ContactsOutlined />,
      label: "基本信息",
    },
    {
      key: `/manager/${connectorCode}/auth`,
      icon: <SafetyOutlined />,
      label: "授权配置",
    },
    {
      key: `/manager/${connectorCode}/publish`,
      icon: <ClusterOutlined />,
      label: "应用发布",
    },
    {
      key: `/manager/${connectorCode}/action`,
      label: "执行操作",
      onTitleClick: () => {
        nav(`/manager/${connectorCode}/action`);
      },
      icon: <DribbbleOutlined />,
      children: actions.map((action) => ({
        key: `/manager/${connectorCode}/action/${action.code}`,
        label: action.name,
      })),
    },
  ];

  return (
    <Menu
      selectedKeys={[pathname]}
      items={items}
      mode="horizontal"
      onClick={(e) => nav(e.key as string)}
    />
  );
};

export default MyMenu;
