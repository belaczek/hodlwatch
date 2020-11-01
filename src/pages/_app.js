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
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no"
          />
          <title>hodl.watch</title>
          <meta charSet="utf-8" />
          <meta name="HandheldFriendly" content="true" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="hodl.watch" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="static/favicon-16x16.png"
          />
          <link
            rel="mask-icon"
            href="static/safari-pinned-tab.svg"
            color="#000000"
          />
          <meta name="theme-color" content="#f6f6f6" />
          <meta
            name="description"
            content="Simple, yet powerful web app for automatic crypto portfolio tracking"
          />
          <link rel="manifest" href="static/manifest.json" />
        </Head>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </>
    );
  }
}

export default withStore(MyApp);
