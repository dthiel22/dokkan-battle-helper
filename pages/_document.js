import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* add google analytics script/gtag here */}

          {/* meta data */}
          <meta charSet="utf-8" />
          <meta property="og:site_name" content="Bytes Analytics"/>
          <meta name="description" content=""/>
          <meta name="keywords" content=""/>

          {/* Add the Google Fonts link tag here */}

        </Head>
        <body>
          {/* Modals */}
          <div id="ConnectWalletModal"/>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
