import React from 'react'
// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <html>
        <Head>
          <title>hodl.watch</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no"
          />
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

          <link rel="manifest" href="static/manifest.json" />
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
