import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
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
