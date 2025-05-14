import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

const pinia = createPinia();
const prefix = import.meta.env.VITE_APP_NAME_SHORT;
pinia.use(
  createPersistedState({
    key: (id) => `__${prefix}__${id}`,
    // storage: sessionStorage,// 默认存储在localStorage中，可选sessionStorage
  })
);
export { pinia };
export * from './auth'
