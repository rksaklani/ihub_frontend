// import { useState, useEffect } from 'react';
// import { useLocation, Routes, Route } from 'react-router-dom';
// import Loader from './common/Loader';
// import PrivateRoute from "./privateroute/PrivateRoute";
// import DefaultLayout from './layout/DefaultLayout';
// import PageTitle from './components/PageTitle';
// import Dashboard from './pages/Dashboard/dashbord';
// // import Calendar from './pages/Calendar';
// // import Profile from './pages/profile';
// import Settings from './pages/settings/Settings';
// import { AddProducts,TotalProducts,BuyNewProducts } from './pages/AddProducts';
// import { Profile } from './pages/profile';
// // import { Alerts,Buttons } from './pages/UiElements';
// import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';

// function App() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   return loading ? (
//     <Loader />
//   ) : (
//     <DefaultLayout>
//       <Routes>
//         {/* Public Routes: No need for PrivateRoute */}
//         <Route
//           path="/signin"
//           element={
//             <>
//               <PageTitle title="Signin | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <SignIn />
//             </>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <>
//               <PageTitle title="Signup | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <SignUp />
//             </>
//           }
//         />

//         {/* Protected Routes: These need PrivateRoute */}
//         <Route
//           index
//           element={
//             <PrivateRoute>
//               <PageTitle title="Dashboard  | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />
//         {/* <Route
//           path="/calendar"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Calendar | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <Calendar />
//             </PrivateRoute>
//           }
//         /> */}
//         <Route
//           path="/profile"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Profile | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <Profile />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/add-products"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Form Elements | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <AddProducts />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/total-products"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Form Layout | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <TotalProducts />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/settings"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Settings | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <Settings />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/buy-new-products"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Buy New Products | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <BuyNewProducts />
//             </PrivateRoute>
//           }
//         />
//         {/* <Route
//           path="/ui/alerts"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Alerts | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <Alerts />
//             </PrivateRoute>
//           }
//         /> */}
//         {/* <Route
//           path="/ui/buttons"
//           element={
//             <PrivateRoute>
//               <PageTitle title="Buttons | IHub Inventory - Tailwind CSS Admin Dashboard Template" />
//               <Buttons />
//             </PrivateRoute>
//           }
//         /> */}
//       </Routes>
//     </DefaultLayout>
//   );
// }

// export default App;



import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store from "./store";
 import { persistor } from "./store";  // Fixed import path for persistor
import RootNavigator from './navigator/rootNavigator';
import { BrowserRouter as Router } from 'react-router-dom';
const App = () => {
  return (
    <>
       <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
      <Router>
        <RootNavigator />
      </Router>
      </PersistGate>
      </Provider>
    </>
  );
};

export default App;
