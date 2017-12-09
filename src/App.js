import React from "react";
import Intro from "./screens/Intro";
import { compose, withState, withHandlers } from "recompose";
import { Provider } from "react-redux";

const renderApp = ({ MainScreen, loadMainScreen }) =>
  MainScreen ? <MainScreen /> : <Intro loadApp={loadMainScreen} />;

const withStore = Component => ({ store, ...props }) => (
  <Provider store={store}>
    <Component {...props} />
  </Provider>
);

const App = compose(
  withStore,
  withState("MainScreen", "setMainScreen", null),
  withHandlers({
    loadMainScreen: ({ setMainScreen }) => async () => {
      const { default: ChildScreen } = await import("./screens/Main");
      setMainScreen(() => ChildScreen);
    }
  })
)(renderApp);

export default App;
