import { ROUTES } from '@src/routes';
import { Breadcrumb } from 'antd';
import { Link, useParams } from 'react-router-dom';

export const BreadCrumbNav = () => {
  const { id } = useParams();

  const items = id ? [{ title: id }] : [];

  return (
    <Breadcrumb
      items={[
        {
          title: (
            <Link to={ROUTES.projects}>
              <span className="font-bold">Мои проекты</span>
            </Link>
          ),
        },
        ...items,
      ]}
    />
  );
};
