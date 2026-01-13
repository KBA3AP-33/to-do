import { ROUTES } from '@src/routes';
import { Breadcrumb } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';

export const BreadCrumbNav = () => {
  const { id } = useParams();
  const { pathname } = useLocation();

  const items: Record<string, string>[] = [];

  if (pathname.includes(ROUTES.projectsCompleted)) items.push({ title: 'Завершенные' });
  if (id) items.push({ title: id });

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
