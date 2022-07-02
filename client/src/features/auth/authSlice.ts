import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUser } from './authAPI';
import { removeRefreshToken } from '../../api/refreshToken';
import { RootState } from '../../app/store';
export interface AuthState {
  auth: {
    user : undefined | {
      email: string,
      username: string,
      roles: [],
      id: string
    },
    accessToken : null | string
  }
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}

const initialState: AuthState = {
  auth : {
    user:undefined,
    accessToken : null,
  },
  status : 'idle',
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.auth.user = action.payload
    },
    setTokens:(state,action : PayloadAction<{accessToken:string}>)=>{
      state.auth.accessToken = action.payload.accessToken;
    },
    logout:(state)=>{
      removeRefreshToken();
      state.auth.user = undefined;
      state.auth.accessToken = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.auth.user = action.payload
      state.status = 'succeeded'
    }).addCase(fetchUser.rejected,(state,action)=>{
      state.status = 'failed'
    })
    builder.addCase(fetchUser.pending,(state,action)=>{
      state.status = 'loading'
    })
  },
});
export const isAuth = (state: RootState) => {
  return state.auth.auth.user !== undefined
};
export const {setUser,setTokens,logout} = authSlice.actions;


export default authSlice.reducer;


///////////////////////////////////// Maybe Usefull ///////////////////////////////////

// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { RootState, AppThunk } from '../client/src/app/store';
// import { fetchCount } from './authAPI';


// // The function below is called a thunk and allows us to perform async logic. It
// // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// // will call the thunk with the `dispatch` function as the first argument. Async
// // code can then be executed and other actions can be dispatched. Thunks are
// // typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );



// // We can also write thunks by hand, which may contain both sync and async logic.
// // Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };


// // The function below is called a selector and allows us to select a value from
// // the state. Selectors can also be defined inline where they're used instead of
// // in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

//Files of Slice
// // The `extraReducers` field lets the slice handle actions defined elsewhere,
//   // including actions generated by createAsyncThunk or in other slices.
//   extraReducers: (builder) => {
//     builder
//       .addCase(incrementAsync.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(incrementAsync.fulfilled, (state, action) => {
//         state.status = 'idle';
//         state.value += action.payload;
//       })
//       .addCase(incrementAsync.rejected, (state) => {
//         state.status = 'failed';
//       });
//   },