import { TinaCMS, TinaProvider } from "tinacms";

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.FC<any>;
  pageProps: any;
}) {
  return (
    <TinaProvider
      cms={
        new TinaCMS({
          sidebar: true,
          enabled: true,
          toolbar: false,
        })
      }
    >
      <Component {...pageProps} />;
    </TinaProvider>
  );
}

export default MyApp;
