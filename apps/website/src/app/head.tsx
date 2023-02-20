export default function Head() {
  return (
    <>
      <meta content="light dark" name="color-scheme" />
      <meta content="darkcord" name="apple-mobile-web-app-title" />
      <meta content="darkcord" name="application-name" />
      <meta content="#181818" name="msapplication-TileColor" />
      <meta content="darkcord" property="og:site_name" />
      <meta content="website" property="og:type" />
      <meta content="darkcord" key="og_title" property="og:title" />
      <meta
        content="https://darkcord.vercel.app/api/og"
        key="og_image"
        property="og:image"
      />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@niskiitwc" name="twitter:creator" />
      <title key="title">Darkcord</title>
      <meta
        content="minimum-scale=1, initial-scale=1, width=device-width"
        name="viewport"
      />
      <meta content="#181818" name="theme-color" />
    </>
  );
}
