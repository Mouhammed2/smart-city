// BusWay and auth-related contracts are scoped under `src/busWay/types`.

interface ApiResponse<T> {
  message?: string;
  data?: T;
  timestamp: string;
}

export {};
