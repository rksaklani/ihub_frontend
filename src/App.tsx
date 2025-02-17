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
