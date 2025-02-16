import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { Mutex } from "async-mutex";
import { apiBaseUrl } from "../components/consts/ApiUriConst";
import store from "../store";
import { authenticationSlice } from "../store/slices/auth.slice";
const mutex = new Mutex();
const baseUrl = `${apiBaseUrl}`;




const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState as typeof store.getState)().authentication?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const fetchbase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result?.error && result.error.status === 401) {
    // checking whether the mutex is locked
    localStorage.removeItem("authenticationToken");
    store.dispatch(authenticationSlice.actions.logout());
    if (!mutex.isLocked()) {
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  } else if (result.error && result.error.status) {
    let msg = getFirstErrorFromObject(result.error.data);
    // if (!msg) {
    //   msg = `Internal server error`;
    // }
    if (!(result.error.data instanceof Blob)) toast.error(msg);
  }

  return result;
};
function getFirstErrorFromObject(obj: any) {
  if (obj?.detail) {
    if (Array.isArray(obj.detail)) {
      const eItem = obj.detail[0];
      if (eItem) {
        return `${eItem.msg}`;
      }
    } else if (obj.detail) {
      return obj.detail.toString();
    }
  }
}
