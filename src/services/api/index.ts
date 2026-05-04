import type { ApiService } from "../api";
import { coreMethods } from "./api-core";
import { taskVendorMethods } from "./api-tasks-vendors";
import { contentMethods } from "./api-content";

export * from "../api-types";

export const api: ApiService = {
  ...coreMethods,
  ...taskVendorMethods,
  ...contentMethods,
} as ApiService;

export {
  apiLogin,
  apiRegister,
  apiCreateWedding,
  apiLogout,
  isAuthenticated,
  clearTokens,
} from "./auth-helpers";
