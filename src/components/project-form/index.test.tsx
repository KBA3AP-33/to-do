import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectForm } from '.';

// Мок для ResizeObserver который используется antd
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ProjectForm component', () => {
  test('renders correctly with all form elements', () => {
    render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} />);

    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
    expect(screen.getByText('Цвет')).toBeInTheDocument();
    expect(screen.getByText('Добавить в избранное')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
  });

  test('uses custom submitText when provided', () => {
    const customText = 'Сохранить проект';
    render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} submitText={customText} />);

    expect(screen.getByRole('button', { name: customText })).toBeInTheDocument();
  });

  test('Компоненты из Ant', () => {
    const { container } = render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} />);

    expect(container.querySelector('.ant-form')).toBeInTheDocument();
    expect(container.querySelector('.ant-btn')).toBeInTheDocument();
  });

  test('Рендер с init', () => {
    const initialValues = {
      name: 'Тестовый проект',
      description: 'Тестовое описание',
      color: '#ff0000',
      isFavourites: true,
    };

    render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} initialValues={initialValues} />);

    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
  });
});

describe('Валидация', () => {
  test('name field exists and has correct label', () => {
    render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} />);

    const nameLabel = screen.getByText('Имя');
    expect(nameLabel).toBeInTheDocument();
  });

  test('description field exists', () => {
    render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} />);

    const descriptionLabel = screen.getByText('Описание');
    expect(descriptionLabel).toBeInTheDocument();
  });
});

describe('ProjectForm button interactions', () => {
  test('cancel button calls onCancel when clicked', () => {
    const handleCancel = jest.fn();
    render(<ProjectForm onSubmit={() => {}} onCancel={handleCancel} />);

    const cancelButton = screen.getByRole('button', { name: 'Отмена' });
    fireEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('submit button exists and has correct text', () => {
    render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} />);

    const submitButton = screen.getByRole('button', { name: 'Добавить' });
    expect(submitButton).toBeInTheDocument();
  });

  test('submit button uses custom text', () => {
    render(<ProjectForm onSubmit={() => {}} onCancel={() => {}} submitText="Сохранить изменения" />);

    const submitButton = screen.getByRole('button', { name: 'Сохранить изменения' });
    expect(submitButton).toBeInTheDocument();
  });
});

describe('ProjectForm user interaction', () => {
  test('fills and submits form correctly', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<ProjectForm onSubmit={handleSubmit} onCancel={() => {}} submitText="Сохранить" />);

    // 1. Заполняем поле имени
    const nameInput = screen.getByLabelText('Имя');
    await user.type(nameInput, 'Мой новый проект');

    // 2. Заполняем поле описания
    const descriptionTextarea = screen.getByLabelText('Описание');
    await user.type(descriptionTextarea, 'Это описание моего нового проекта');

    // 3. Включаем переключатель "Избранное"
    const favouriteSwitch = screen.getByRole('switch');
    await user.click(favouriteSwitch);

    // 4. Нажимаем кнопку отправки
    const submitButton = screen.getByRole('button', { name: 'Сохранить' });
    await user.click(submitButton);

    // 5. Проверяем что onSubmit был вызван
    expect(handleSubmit).toHaveBeenCalledTimes(1);

    // 6. Проверяем что в onSubmit переданы правильные данные
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Мой новый проект',
        description: 'Это описание моего нового проекта',
        isFavourites: true,
      })
    );
  });

  // test('fills form with all fields including color and submits', async () => {
  //   const user = userEvent.setup();
  //   const handleSubmit = jest.fn();

  //   render(<ProjectForm onSubmit={handleSubmit} onCancel={() => {}} />);

  //   // Заполняем все поля
  //   await user.type(screen.getByLabelText('Имя'), 'Проект с цветом');
  //   await user.type(screen.getByLabelText('Описание'), 'Проект с выбранным цветом');

  //   // Выбираем цвет (если ColorPicker рендерится как input[type="color"])
  //   const colorInputs = screen.getAllByLabelText('Цвет');
  //   const colorPicker = colorInputs.find(input => input.tagName === 'INPUT');

  //   if (colorPicker) {
  //     await user.type(colorPicker, '#ff5733');
  //   }

  //   // Отправляем форму
  //   await user.click(screen.getByRole('button', { name: 'Добавить' }));

  //   expect(handleSubmit).toHaveBeenCalledTimes(1);
  // });

  test('submits form with only required field', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<ProjectForm onSubmit={handleSubmit} onCancel={() => {}} />);

    // Заполняем только обязательное поле
    await user.type(screen.getByLabelText('Имя'), 'Только имя');

    // Отправляем форму
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Только имя',
      })
    );
  });
});
