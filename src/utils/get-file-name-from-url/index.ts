export const getFileNameFromUrl = (url?: string): string | undefined => {
  const name = url?.split('_')?.slice(1).join('_');
  if (!name) return;

  return decodeURIComponent(name);
};
