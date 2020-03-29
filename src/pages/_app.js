import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import withStore from "utils/decorators/withStore";
import Head from "next/head";

import "styles/app.sass";
import "react-toastify/dist/ReactToastify.min.css";

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <>
        <Head>
          <title>hodl.watch</title>
        </Head>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </>
    );
  }
}

export default withStore(MyApp);
