import { type ComponentProps, type FC } from 'react';
import { Flex, Layout } from 'antd';
import { HomeHeader } from '@src/containers/home-header';

const { Content } = Layout;

export const HomeLayout: FC<ComponentProps<'div'>> = ({ children }) => {
  return (
    <Layout className="min-h-screen" style={{ minHeight: '100vh' }}>
      <HomeHeader />
      <Content>
        <Flex className="h-full" vertical>
          <div className="h-full p-4 flex flex-col">{children}</div>
        </Flex>
      </Content>
    </Layout>
  );
};
