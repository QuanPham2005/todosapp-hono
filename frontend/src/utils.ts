export const formatDate = (value: string | null) => {
  if (!value) return 'Không có';
  const date = new Date(value);
  return isNaN(date.getTime()) ? 'Không hợp lệ' : date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
};
