import { ToolbarWidgetPlugin } from "./connectionToolbarWidget";
import { Button } from "@tinacms/styles";
export const ClickToConnect: React.FC = () => {
  return (
    <Button
      onClick={() => {
        const location = window.location.href + "#1";
        navigator.clipboard.writeText(location);
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
