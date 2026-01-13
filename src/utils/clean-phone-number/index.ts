export const cleanPhoneNumber = (phone?: string) => {
  if (phone?.includes('_')) return null;
  return phone?.replace(/[^\d+]/g, '');
};
