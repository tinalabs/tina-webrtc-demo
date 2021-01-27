import styled, { css } from "styled-components";
import { usePeers } from ".";

export interface ToolbarWidgetPlugin<Props = any> {
  __type: "toolbar:widget";
  name: string;
  weight: number;
  component(): React.ReactElement;
  props?: Props;
}

interface StatusLightProps {
  warning?: boolean;
}

const StatusLight = styled.span<StatusLightProps>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  margin-top: -1px;
  background-color: #3cad3a;
  border: 1px solid #249a21;
  margin-right: 5px;
  opacity: 0.5;

  ${(p) =>
    p.warning &&
    css`
      background-color: #e9d050;
      border: 1px solid #d3ba38;
      opacity: 1;
    `};
`;
const DesktopLabel = styled.span`
  all: unset;
  color: inherit;
  display: none;
  @media (min-width: 1030px) {
    display: inline;
  }
`;
const StatusMessage = styled.p`
  font-size: var(--tina-font-size-3);
  display: flex;
  align-items: center;
  color: var(--tina-color-grey-6);
  padding-right: 4px;
  line-height: 1.35;
  margin: 0;
`;

export const ConnectedWidgetButton: React.FC<any> = () => {
  const { connected } = usePeers();
  return (
    <div>
      {!connected ? (
        <StatusMessage>
          <StatusLight warning />{" "}
          <DesktopLabel>Not connected to a peer</DesktopLabel>
        </StatusMessage>
      ) : (
        <StatusMessage>
          <StatusLight /> <DesktopLabel>Connected to a peer</DesktopLabel>
        </StatusMessage>
      )}
    </div>
  );
};

export const ConnectedWidget: ToolbarWidgetPlugin = {
  __type: "toolbar:widget",
  name: "connected-to-peer",
  //   @ts-ignore
  component: ConnectedWidgetButton,
  weight: 0,
};
