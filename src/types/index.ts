// BusWay and auth-related contracts are scoped under `src/busway/types`.

interface ApiResponse<T> {
  message?: string;
  data?: T;
  timestamp: string;
}

export {};
