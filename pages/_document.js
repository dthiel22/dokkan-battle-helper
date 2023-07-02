import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-XR832YLLT5"
          strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-XR832YLLT5');
            `}
          </Script>
          <meta charSet="utf-8" />
          <meta property="og:site_name" content="Dokkan Battle Helper"/>
          <meta name="description" content="Create the best Dokkan Battle teams with the most links"/>
          <meta name="keywords" content="dokkan, battle, team, buildiong, link tool, cards, links, categories, help, helper"/>

          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="apple-mobile-web-app-title" content="Dokkan Battle Helper"/>
          <meta name="application-name" content="Dokkan Battle Helper"/>
          <meta name="mobile-web-app-capable" content="yes"/>
          {/* Add the Google Fonts link tag here */}
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
          <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <div id="Announcement"></div>
          <div id="WebOptionsModal"></div>
          <div id="SelectTeamToStageModal"></div>
          <div id="MakeTeamFromScratch"></div>
          <div id="CharacterSelectionModal"></div>
          <div id="NewTeamForTeamPostModal"></div>
          <div id="AllTeamInfoModal"></div>
          <div id="WarningRemoveTeamPostModal"></div>
          <div id="WarningRemoveCommentModal"></div>
          <div id="WarningRemoveReplyModal"></div>
          <div id="TeamAnalysis"></div>
          <div id="WarningModal"></div>
          <div id="ErrorModal"></div>
          <div id="LoginPortal"></div>
          <div id="HamburgerPortal"></div>
          <div id="HelpPortal"></div>
          <div id="NewsAndUpdatesPortal"></div>
          <div id="MakeTeamForm"></div>
          <div id="EditTeamForm"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
