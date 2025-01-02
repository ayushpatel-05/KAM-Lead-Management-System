"use client";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Provider } from 'react-redux';
import { store } from "../redux/configureStore";
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import {
  CalendarOutlined,
  DesktopOutlined,
  FileOutlined,
  FundProjectionScreenOutlined,
  FundViewOutlined,
  FunnelPlotOutlined,
  HistoryOutlined,
  HomeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Search from "antd/es/input/Search";
import ProductLogo from "../../public/team-management.png";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items: MenuItem[] = [
  getItem(<Link href="/dashboard">Dashboard</Link>, '1', <PieChartOutlined />),
  getItem(<Link href="/restaurants">Restaurants</Link>, '2', <HomeOutlined />),
  getItem(<Link href="/leads">Leads</Link>, '3', <FunnelPlotOutlined />),
  getItem(<Link href="/contacts">Contacts</Link>, '4', <IdcardOutlined />),
  getItem(<Link href="/call-schedule">Call Schedule</Link>, '5', <CalendarOutlined />),
  getItem(<Link href="/interactions">Interactions</Link>, '6', <PhoneOutlined />),
  getItem(<Link href="/performance">Performance Analysis</Link>, '7', <FundProjectionScreenOutlined />),
  // getItem('User', 'sub1', <UserOutlined />, [
  //   getItem(<Link href="/user/tom">Tom</Link>, '4'),
  //   getItem(<Link href="/user/bill">Bill</Link>, '5'),
  //   getItem(<Link href="/user/alex">Alex</Link>, '6'),
  // ]),
  // getItem('Team', 'sub2', <TeamOutlined />, [
  //   getItem(<Link href="/team/team1">Team 1</Link>, '7'),
  //   getItem(<Link href="/team/team2">Team 2</Link>, '8'),
  // ]),
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState('1');

  const onSearch = (text: any) => {
    console.log(text);
  }

  useEffect(() => {
    const pathToKeyMap: { [key: string]: string } = {
      '/dashboard': '1',
      '/restaurants': '2',
      '/leads': '3',
      '/contacts': '4',
      '/call-schedule': '5',
      '/interactions': '6',
      '/performance': '7',
    };
    setSelectedKey(pathToKeyMap[pathname] || '1');
  }, [pathname]);

  return (
    <html lang="en">
      <body className="antialiased">
        <Provider store={store}>
          <AntdRegistry>
            <Layout style={{ minHeight: '100vh' }}>
              <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                  <h1 className="text-white font-bold text-3xl text-wrap text-center p-2">Udaan LMS</h1>
                <Search
                  placeholder="Search..."
                  onSearch={onSearch}
                  style={{ margin: '5px',marginBottom: '1rem' , width: 'auto' }}
                />
                <Menu
                  theme="dark"
                  selectedKeys={[selectedKey]}
                  mode="inline"
                  items={items}
                />
              </Sider>
              <Layout>
                <Content style={{ margin: '0 16px' }}>
                  <Breadcrumb style={{ margin: '16px 0' }} items={[{title: "Dashboard"}]}>
                  </Breadcrumb>
                  <div
                    style={{
                      padding: 24,
                      minHeight: 360,
                      background: colorBgContainer,
                      borderRadius: borderRadiusLG,
                    }}
                  >
                    {children}
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
              </Layout>
            </Layout>
          </AntdRegistry>
        </Provider>
      </body>
    </html>
  );
}
