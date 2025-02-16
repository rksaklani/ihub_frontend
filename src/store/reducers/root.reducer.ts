
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { LOCAL_STORAGE_KEY } from '../../components/consts/local_storage_const'; // Ensure this path is correct
import { authenticationSlice } from '../slices/auth.slice'; // Import the auth slice reducer
import { baseApi } from '../api/base/baseApi'; // Import the base API reducer



const authPersistConfig = {
  key: LOCAL_STORAGE_KEY.AUTH,
  storage,
  blacklist: ['loading'],
};

export const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  [authenticationSlice.name]: persistReducer(authPersistConfig, authenticationSlice.reducer),
};
