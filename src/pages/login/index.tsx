import { AuthLayout } from '@src/layouts/auth';
import { ROUTES } from '@src/routes';
import { login as loginApi } from '@src/store/auth/slice';
import { Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@src/store';
import { validator } from '@src/utils/validator';

interface LoginValues {
  email: string;
  password: string;
}

const { Title } = Typography;

export const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { isLoadingApi } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const login = async (values: LoginValues) => {
    const resultAction = await dispatch(loginApi(values));

    if (loginApi?.fulfilled?.match(resultAction)) {
      navigate(ROUTES.projects);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Добро пожаловать
          </Title>
          <p className="text-gray-600">Войдите в свой аккаунт</p>
        </div>

        <Form form={form} onFinish={login} layout="vertical" autoComplete="off">
          <div className="mb-8">
            <Form.Item name="email" label="Email" rules={[{ validator: validator.email }]}>
              <Input
                placeholder="Введите email"
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item name="password" label="Пароль" rules={[{ validator: validator.password }]}>
              <Input.Password
                placeholder="Введите пароль"
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button color="green" type="primary" htmlType="submit" size="large" loading={isLoadingApi} block>
              Войти
            </Button>
          </Form.Item>

          <div className="text-center mb-4">
            <p className="mt-4 text-gray-600">
              Нет аккаунта?{' '}
              <Link
                to={ROUTES.registration}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="text-center">
            <p className="mt-4 text-gray-600">
              Вернуться{' '}
              <Link
                to={ROUTES.index}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                На главную
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </AuthLayout>
  );
};
