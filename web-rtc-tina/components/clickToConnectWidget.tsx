import { ToolbarWidgetPlugin } from "./connectionToolbarWidget";
import { Button } from "@tinacms/styles";
import { usePeers } from "./context";

export const ClickToConnect: React.FC = () => {
  const { peer } = usePeers();
  return (
    <Button
      onClick={() => {
        const location = window.location.href + "#1";
        navigator.clipboard.writeText(location);
        setTimeout(async () => {
          const res = await fetch("/api/signal?slug=/");
          const { answer } = await res.json();
          if (answer) {
            peer?.signal(answer);
          }
        }, 10000);
      }}
    >
      Copy share link
    </Button>
  );
};

export const ClickToConnectWidget: ToolbarWidgetPlugin = {
  __type: "toolbar:widget",
  //   @ts-ignore
  component: ClickToConnect,
};
