// lib/utils/apiUtils.ts

// Simple API request utility
export const apiRequest = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Date formatting utility
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Simple error handler
export const handleError = (error: unknown, action: string): void => {
  const message = error instanceof Error ? error.message : 'An error occurred';
  console.error(`Error ${action}:`, message);
};