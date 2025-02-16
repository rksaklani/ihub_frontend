// import { createSlice } from "@reduxjs/toolkit";





// export interface IAuthMe {
//   email?: string;
//   password?: string;
//   name?: string;
//   token: AuthLoginApiResponse;
// }

// export type AuthLoginApiResponse = {
//   token: string;
//   user:any
// };


// export const authenticationSlice = createSlice({
//   name: "authentication",
//   initialState: {} as IAuthState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const { user, accessToken, admin } = action.payload;
//       state.me = user;
//       state.token = accessToken;
//       state.user = admin;
//     },
//     logout: (state) => {
//       state.token = "";
//       state.loading = false;
//       state.me = undefined;
//       state.user = undefined;
//       window.localStorage.removeItem("persist:authentication");
//     },
//     removeMe: (state) => {
//       state.me = undefined;
//     },
//     updateMe: (state, { payload }) => {
//       state.me = {
//         ...state.me,
//         ...payload,
//       } as IAuthMe;
//     },
//   },
// });








// import { createSlice } from "@reduxjs/toolkit";

// // Define the AuthLoginApiResponse type

// // Define the IAuthMe interface
// export interface IAuthMe {
//   email?: string;
//   password?: string;
//   name?: string;
//   token: string; // This will hold the token and user information
// }

// // Define the IAuthState interface
// export interface IAuthState {
//   token: string;
//   loading: boolean;
//   me?: IAuthMe; // User information
//   user?: any; // You can replace 'any' with a more specific type if available
// }
// 
// // Create the authentication slice
// export const authenticationSlice = createSlice({
//   name: "authentication",
//   initialState: {
//     token: "",
//     loading: false,
//     me: undefined,
//     user: undefined,
//   } as IAuthState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const { user, token } = action.payload; // Adjusted to match the payload structure
//       state.me = {
//         email: user.email,
//         name: user.name,
//         password: user.password, // If you want to store the password, be cautious about security
//         token:  token, // Store the token and user in the me object
//       };
//       state.token = token; // Store the token in the state
//     },
//     logout: (state) => {
//       state.token = "";
//       state.loading = false;
//       state.me = undefined;
//       state.user = undefined;
//       window.localStorage.removeItem("persist:authentication");
//     },
//     removeMe: (state) => {
//       state.me = undefined;
//     },
//     updateMe: (state, { payload }) => {
//       if (state.me) {
//         state.me = {
//           ...state.me,
//           ...payload,
//         };
//       }
//     },
//   },
// });

// // Export actions and reducer
// export const { setCredentials, logout, removeMe, updateMe } = authenticationSlice.actions;
// export default authenticationSlice.reducer;





import { createSlice } from "@reduxjs/toolkit";


// Define a proper user interface (replace with actual fields)
interface IUser {
  id: string;
  email: string;
  name: string;
}

export type AuthLoginApiResponse = {
  token: string;
  user: IUser; // Use a specific type instead of 'any'
};

export interface IAuthMe {
  email?: string;
  name?: string;
  token: AuthLoginApiResponse; // Matches the response structure
}

export interface IAuthState {
  token: string;
  loading: boolean;
  me?: IAuthMe;
  user?: IUser; // Use the same IUser type here
}

export const authenticationSlice = createSlice({
  
  name: "authentication",
  initialState: {
    token: "",
    loading: false,
    me: undefined,
    user: undefined,
  } as IAuthState,
  reducers: {
    
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.me = user;
      state.token = user.access_token;
    // Correctly nes
    console.log("action.payload",action.payload)
    },
    logout: (state) => {
      state.token = "";
      state.loading = false;
      state.me = undefined;
      state.user = undefined;
      window.localStorage.removeItem("persist:authentication");
    },
    removeMe: (state) => {
      state.me = undefined;
    },
    updateMe: (state, { payload }) => {
      if (state.me) {
        state.me = {
          ...state.me,
          ...payload,
        };
      }
    },
  },
});




// Export actions
// export const { logout } = authenticationSlice.actions;

// export default authenticationSlice.reducer;