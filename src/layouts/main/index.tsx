import { type ComponentProps, type FC } from 'react';
import { Flex, Layout } from 'antd';
import { Sidebar } from '@src/containers/sidebar';
import { MainHeader } from '@src/containers/main-header';

const { Content } = Layout;

export const MainLayout: FC<ComponentProps<'div'>> = ({ children }) => {
  return (
    <Layout className="min-h-screen" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <MainHeader />
        <Content>
          <Flex className="h-full" vertical>
            <div className="h-full p-4 flex flex-col">{children}</div>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};
