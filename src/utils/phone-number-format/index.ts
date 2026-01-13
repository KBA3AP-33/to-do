export const phoneNumberFormat = (mask: string, phone: string) => {
  let index = phone.startsWith('+') ? 1 : 0;
  let result = '';

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] !== '0') result += mask[i];
    else result += phone[index++] ?? '_';
  }
  return result;
};
