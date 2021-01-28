import { TinaCMS, TinaProvider } from "tinacms";
import { PeerProvider } from "../web-rtc-tina/components";
import { MarkdownFieldPlugin, HtmlFieldPlugin } from "react-tinacms-editor";
function MyApp({
  Component,
  pageProps,
}: {
  Component: React.FC<any>;
  pageProps: any;
}) {
  const cms = new TinaCMS({
    sidebar: true,
    enabled: true,
    toolbar: true,
  });
  cms.plugins.add(MarkdownFieldPlugin);
  cms.plugins.add(HtmlFieldPlugin);
  return (
    <PeerProvider cms={cms} config={{ shareSideBar: true }}>
      <TinaProvider cms={cms}>
        <Component {...pageProps} />
      </TinaProvider>
    </PeerProvider>
  );
}

export default MyApp;
