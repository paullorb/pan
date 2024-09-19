// src/utils/authFetch.ts
export const authFetch = async (url: string, options: any = {}) => {
  const accessToken = localStorage.getItem('accessToken');

  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

  const response = await fetch(url, options);

  return response;
};
