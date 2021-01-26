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
    <TinaProvider
      cms={
        new TinaCMS({
          sidebar: true,
          enabled: true,
          toolbar: false,
        })
      }
    >
      <PeerProvider>
        <Component {...pageProps} />
      </PeerProvider>
    </TinaProvider>
  );
}

export default MyApp;
