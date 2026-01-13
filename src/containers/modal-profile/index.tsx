import { useState, type FC } from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@src/store';
import { updateProfile } from '@src/store/auth/slice';
import { ProfileForm } from '@src/components/profile-form';
import { Profile } from '@src/components/profile';
import type { User } from '@src/types';
import { ModalTitle } from '@src/components/modal-title';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  onLogout: () => Promise<void>;
}

export const ModalProfile: FC<Props> = ({ isModalOpen, setIsModalOpen, onLogout }) => {
  const { user, isLoadingApi } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [isEdit, setIsEdit] = useState(false);

  const onCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const onSubmit = async (values: Pick<User, 'username' | 'lastname' | 'phone' | 'image'>, isClose = true) => {
    await dispatch(updateProfile(values));
    if (isClose) setIsEdit(false);
  };

  if (!user) return null;

  return (
    <Modal
      title={<ModalTitle title={isEdit ? 'Редактировать профиль' : 'Мой профиль'} />}
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      {isEdit ? (
        <ProfileForm
          initialValues={user}
          onCancel={() => setIsEdit(false)}
          onSubmit={onSubmit}
          isLoading={isLoadingApi}
        />
      ) : (
        <Profile user={user} onEdit={() => setIsEdit(true)} onLogout={onLogout} />
      )}
    </Modal>
  );
};
