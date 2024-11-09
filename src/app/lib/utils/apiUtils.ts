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

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Unknown error occurred');
  }
};

// Date formatting utility
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Simple error handler
export const handleError = (err: unknown, action: string): void => {
  const error = err instanceof Error ? err : new Error('Unknown error occurred');
  console.error(`Error ${action}:`, error.message);
};