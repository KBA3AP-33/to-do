import { useState } from 'react';
import type { UploadProps } from 'antd';
import type { FC, MouseEventHandler } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteImageMutation, useUploadImageMutation } from '@src/store/upload/api';
import { Upload, Button, Spin, Flex, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getFileNameFromUrl } from '@src/utils/get-file-name-from-url';

interface Props {
  initImageUrl?: string;
  onChange?: (value: string) => void;
}

const { Text } = Typography;

export const UploadImage: FC<Props> = ({ initImageUrl, onChange }) => {
  const [previewImage, setPreviewImage] = useState(initImageUrl);
  const [fileName, setFileName] = useState(getFileNameFromUrl(initImageUrl));

  const [uploadImage, { isLoading: isLoadingUpload }] = useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDelete }] = useDeleteImageMutation();

  const handleChange: UploadProps['customRequest'] = async ({ file }) => {
    const { url = '' } = (await uploadImage(file as Blob)).data ?? {};
    setFileName(getFileNameFromUrl(url));
    setPreviewImage(url);
    onChange?.(url);
  };

  const onDelete: MouseEventHandler = async e => {
    e.stopPropagation();

    const data = previewImage?.split('/');
    const fileName = data?.[data.length - 1] ?? '';
    await deleteImage(fileName);
    setFileName('');
    setPreviewImage('');
    onChange?.('');
  };

  return (
    <Flex gap={8} vertical>
      <Upload
        name="file"
        accept="image/*"
        listType="picture-card"
        customRequest={handleChange}
        showUploadList={false}
        multiple={false}
        maxCount={1}
      >
        {isLoadingUpload || isLoadingDelete ? (
          <Spin data-testid="loader" />
        ) : previewImage ? (
          <div className="relative group px-1">
            <img
              draggable={false}
              src={previewImage}
              alt="avatar"
              className="rounded-md group-hover:brightness-75 transition duration-200"
            />
            <Button
              color="primary"
              variant="filled"
              shape="circle"
              size="small"
              className="!absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              icon={<DeleteOutlined />}
              onClick={onDelete}
            />
          </div>
        ) : (
          <button className="border-[0px]" type="button">
            <PlusOutlined />
            <div className="mt-[8px]">Загрузить</div>
          </button>
        )}
      </Upload>
      {!!fileName && <Text className="max-w-[100px] line-clamp-[1]">{fileName}</Text>}
    </Flex>
  );
};
