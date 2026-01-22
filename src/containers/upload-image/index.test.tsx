import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { useUploadImageMutation, useDeleteImageMutation } from '@src/store/upload/api';
import { getFileNameFromUrl } from '@src/utils/get-file-name-from-url';
import { UploadImage } from '.';

jest.mock('@src/store/upload/api');
jest.mock('@src/utils/get-file-name-from-url');

const mockUploadImageMutation = jest.fn();
const mockDeleteImageMutation = jest.fn();
const mockGetFileNameFromUrl = jest.fn();

describe('UploadImage', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useUploadImageMutation as jest.Mock).mockReturnValue([mockUploadImageMutation, { isLoading: false }]);
    (useDeleteImageMutation as jest.Mock).mockReturnValue([mockDeleteImageMutation, { isLoading: false }]);
    (getFileNameFromUrl as jest.Mock).mockImplementation(mockGetFileNameFromUrl);
  });

  describe('Рендер', () => {
    test('Должно отрендериться без изображения', () => {
      render(<UploadImage onChange={mockOnChange} />);

      expect(screen.getByText('Загрузить')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /загрузить/i })).toBeInTheDocument();
    });

    test('Должно отрендериться с изображением', () => {
      const url = 'https://example.com/image.jpg';
      const fileName = 'image.jpg';

      mockGetFileNameFromUrl.mockReturnValue(fileName);

      render(<UploadImage initImageUrl={url} onChange={mockOnChange} />);

      const image = screen.getByAltText('avatar');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', url);
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });
  });

  describe('Загрузка', () => {
    test('Должен вызываться onChange после загрузки', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const url = 'https://example.com/uploaded.jpg';

      mockUploadImageMutation.mockResolvedValue({ data: { url } });
      mockGetFileNameFromUrl.mockReturnValue('test.png');

      render(<UploadImage onChange={mockOnChange} />);

      const input = screen
        .getByRole('button', { name: /загрузить/i })
        .closest('div')
        ?.querySelector('input[type="file"]');

      await userEvent.upload(input as HTMLElement, file);

      await waitFor(() => {
        expect(mockUploadImageMutation).toHaveBeenCalledWith(file);
        expect(mockOnChange).toHaveBeenCalledWith(url);
      });
    });

    test('Должен рендериться индикатор загрузки', () => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();

      (useUploadImageMutation as jest.Mock).mockReturnValue([mockUploadImageMutation, { isLoading: true }]);

      render(<UploadImage onChange={mockOnChange} />);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Удаление', () => {
    test('Должен работать клик на кнопку удаления', async () => {
      const url = 'https://example.com/images/test.jpg';
      const fileName = 'test.jpg';

      mockGetFileNameFromUrl.mockReturnValue(fileName);
      mockDeleteImageMutation.mockResolvedValue({});

      render(<UploadImage initImageUrl={url} onChange={mockOnChange} />);

      const image = screen.getByAltText('avatar').closest('.relative');

      if (image) {
        await userEvent.hover(image);
        const button = screen.getByRole('button', { name: /delete/i });
        await userEvent.click(button);

        expect(mockDeleteImageMutation).toHaveBeenCalledWith(fileName);
      }
    });

    test('Должно вызываться удаление', async () => {
      const url = 'https://example.com/images/test.jpg';

      mockGetFileNameFromUrl.mockReturnValue('test.jpg');
      mockDeleteImageMutation.mockResolvedValue({});

      render(<UploadImage initImageUrl={url} onChange={mockOnChange} />);

      const image = screen.getByAltText('avatar').closest('.relative');

      if (image) {
        await userEvent.hover(image);
        const button = screen.getByRole('button', { name: /delete/i });
        await userEvent.click(button);

        await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith(''));
      }
    });

    test('Должно появляться индикатор загрузки при удалении', () => {
      const initImageUrl = 'https://example.com/image.jpg';

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();

      mockGetFileNameFromUrl.mockReturnValue('image.jpg');
      (useDeleteImageMutation as jest.Mock).mockReturnValue([mockDeleteImageMutation, { isLoading: true }]);

      render(<UploadImage initImageUrl={initImageUrl} onChange={mockOnChange} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('URL', () => {
    test('Должно выводитсья имя файла', () => {
      const url = 'https://example.com/path/to/image.jpg';
      const fileName = 'image.jpg';

      expect(screen.queryByText(fileName)).not.toBeInTheDocument();

      mockGetFileNameFromUrl.mockReturnValue(fileName);
      render(<UploadImage initImageUrl={url} onChange={mockOnChange} />);

      expect(getFileNameFromUrl).toHaveBeenCalledWith(url);
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });

    test('URL должен удаляться при удалении', async () => {
      const initImageUrl = 'https://example.com/path/to/image.png';

      mockGetFileNameFromUrl.mockReturnValue('image.png');
      mockDeleteImageMutation.mockResolvedValue({});

      render(<UploadImage initImageUrl={initImageUrl} onChange={mockOnChange} />);

      const image = screen.getByAltText('avatar').closest('.relative');

      if (image) {
        await userEvent.hover(image);
        const button = screen.getByRole('button', { name: /delete/i });
        await userEvent.click(button);

        expect(mockDeleteImageMutation).toHaveBeenCalledWith('image.png');
      }
    });
  });

  describe('Обработка ошибок', () => {
    test('Должно работать при отсутствии данных в ответе', async () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      mockUploadImageMutation.mockResolvedValue({ data: undefined });

      render(<UploadImage onChange={mockOnChange} />);

      const input = screen
        .getByRole('button', { name: /загрузить/i })
        .closest('div')
        ?.querySelector('input[type="file"]');

      await userEvent.upload(input as HTMLElement, file);
      await waitFor(() => expect(mockUploadImageMutation).toHaveBeenCalled());
    });

    test('Должно работать с пустой строкой при удалении', () => {
      render(<UploadImage initImageUrl={''} onChange={mockOnChange} />);
      expect(screen.queryByAltText('avatar')).not.toBeInTheDocument();
    });
  });
});
