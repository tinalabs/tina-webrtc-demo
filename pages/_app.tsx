import { TinaCMS, TinaProvider } from "tinacms";
import { PeerProvider } from "../web-rtc-tina/components";

function MyApp({
  Component,
  pageProps,
}: {
  Component: React.FC<any>;
  pageProps: any;
}) {
  return (
    <PeerProvider
    // config={{ toolbar: true }}
    >
      <TinaProvider
        cms={
          new TinaCMS({
            sidebar: true,
            enabled: true,
            toolbar: true,
          })
        }
      >
        <Component {...pageProps} />
      </TinaProvider>
    </PeerProvider>
  );
}

export default MyApp;
