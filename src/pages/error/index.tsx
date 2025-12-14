import { ROUTES } from '@src/routes';
import { RetweetOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Error } from '@src/components/error';

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Error
      title="ERROR"
      subTitle="Упс! Что-то пошло не так..."
      homeButtonClick={() => navigate(ROUTES.index)}
      backButtonText="Обновить страницу"
      backButtonClick={() => navigate(0)}
      backButtonIcon={<RetweetOutlined />}
    />
  );
};
