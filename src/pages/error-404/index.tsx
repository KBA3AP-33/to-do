import { ROUTES } from '@src/routes';
import { useNavigate } from 'react-router-dom';
import { Error } from '@src/components/error';

export const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <Error
      title="ERROR 404"
      subTitle="Упс! Кажется, вы заблудились в цифровом пространстве..."
      homeButtonClick={() => navigate(ROUTES.index)}
      backButtonClick={() => navigate(-1)}
    />
  );
};
