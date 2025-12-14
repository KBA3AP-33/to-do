import { Input } from 'antd';
import { type FC, memo } from 'react';
import type { SearchProps } from 'antd/es/input';
import { useDebounce } from '@src/hooks/use-debounce';

const { Search } = Input;

interface Props extends SearchProps {
  value?: string;
  onSearch?: (value: string) => void;
}

export const DebouncedSearch: FC<Props> = memo(({ value = '', onSearch, ...props }) => {
  const { value: search, onChange } = useDebounce(value, onSearch);

  return <Search value={search} onChange={onChange} className="w-full" {...props} />;
});
