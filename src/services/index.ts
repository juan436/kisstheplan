import { mockApi } from "./mock-api";
import { realApi } from "./real-api";

const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true";

// Single point of change: swap mockApi for a real API client here
export const api = useRealApi ? realApi : mockApi;
