import { AuthLayout } from '@src/layouts/auth';
import { ROUTES } from '@src/routes';
import type { AppDispatch, RootState } from '@src/store';
import { register as registerApi } from '@src/store/auth/slice';
import { validator } from '@src/utils/validator';
import { Button, Card, Form, Input, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface RegistrationValues {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const RegistrationPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { isLoadingApi } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const register = async (values: RegistrationValues) => {
    if (values.password !== values.passwordConfirm) return;

    await dispatch(registerApi(values));
    navigate(ROUTES.projects);
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Создать аккаунт
          </Title>
        </div>

        <Form form={form} onFinish={register} layout="vertical" autoComplete="off">
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

            <Form.Item
              name="passwordConfirm"
              label="Повторите пароль"
              rules={[{ validator: (r, v) => validator.confirmPassword(r, v, form.getFieldValue('password')) }]}
            >
              <Input.Password
                placeholder="Введите пароль"
                size="large"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={isLoadingApi} block>
              Зарегистрироваться
            </Button>
          </Form.Item>

          <div className="text-center">
            <p className="mt-4 text-gray-600">
              Уже есть аккаунт?{' '}
              <Link
                to={ROUTES.login}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Войти
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </AuthLayout>
  );
};
