import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';

export class TestHelper {
  public static fill = {
    input: async (text: RegExp | string, value: string) => {
      const input = screen.getByLabelText(text);
      fireEvent.change(input, { target: { value } });
      expect(input).toHaveValue(value);
    },
    phone: async (text: RegExp | string, value: string) => {
      const input = screen.getByLabelText(text);
      await userEvent.clear(input);
      await userEvent.type(input, value);
    },
  };

  public static check = {
    input: (text: RegExp | string, value: string, isNot = false) => {
      const input = screen.getByLabelText(text);
      if (isNot) return expect(input).not.toHaveValue(value);

      expect(input).toHaveValue(value);
    },
    error: (text: RegExp | string, isNot = false) => {
      if (isNot) return expect(text).not.toBeInTheDocument();

      expect(text).toBeInTheDocument();
    },
  };

  public static form = {
    submit: async (button: RegExp | string, click: () => unknown, value: unknown) => {
      const submit = screen.getByRole('button', { name: button });
      await userEvent.click(submit);
      expect(click).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledWith(value);
    },
  };
}
