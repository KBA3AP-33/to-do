import { HomeStep } from '@src/components/home-step';
import { useThemeToken } from '@src/hooks/use-theme-token';
import { HomeLayout } from '@src/layouts/home';
import { ROUTES } from '@src/routes';
import type { RootState } from '@src/store';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
  const { token } = useThemeToken();

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <HomeLayout>
      <main className="h-full pt-6 flex flex-col justify-start items-center">
        <section className="py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Управляйте своими задачами
              <span style={{ color: token?.colorCustomPrimary }}> эффективно</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              TaskMaster помогает организовать ваши задачи, проекты и цели в одном месте. Создавайте, отслеживайте и
              выполняйте задачи с легкостью.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-x-6 mt-10">
              <Button
                variant="solid"
                color="primary"
                style={{ display: 'block', height: 'auto' }}
                onClick={() => navigate(user ? ROUTES.projects : ROUTES.login)}
              >
                <div className="py-3 px-8 text-lg font-bold">Начать бесплатно</div>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">Как это работает</h2>
            <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
              <HomeStep
                num={1}
                title="Создайте аккаунт"
                subtitle="Зарегистрируйтесь, чтобы получить доступ ко всем функциям TaskMaster"
              />
              <HomeStep
                num={2}
                title="Добавьте задачи"
                subtitle="Создавайте задачи, устанавливайте приоритеты и сроки выполнения"
              />
              <HomeStep
                num={3}
                title="Выполняйте и отслеживайте"
                subtitle="Отмечайте выполненные задачи и следите за своим прогрессом"
              />
            </div>
          </div>
        </section>
      </main>
    </HomeLayout>
  );
};
