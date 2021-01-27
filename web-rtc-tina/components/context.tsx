import React, { useContext, useState } from "react";
import { Instance } from "simple-peer";
import { Curser } from "../curser/Cursor";

const PeerContext = React.createContext(
  (undefined as unknown) as {
    peer: Instance | undefined;
    setPeer: React.Dispatch<React.SetStateAction<Instance | undefined>>;
    setFirstPeer: React.Dispatch<React.SetStateAction<boolean>>;
    _setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    _setUsingPeerEditingCurser: React.Dispatch<React.SetStateAction<boolean>>;
    firstPeer: boolean;
    connected: boolean;
    setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  }
);

export const PeerProvider: React.FC<{ initialPeer?: Instance }> = ({
  children,
}) => {
  const [peer, setPeer] = useState<Instance>();
  const [firstPeer, setFirstPeer] = useState(true);
  const [_usingPeerEditingCurser, _setUsingPeerEditingCurser] = useState(false);
  const [_pos, _setPos] = useState({ x: -100, y: -100 });
  const [connected, setConnected] = useState(false);

  return (
    <PeerContext.Provider
      value={{
        peer,
        setPeer,
        firstPeer,
        setFirstPeer,
        _setUsingPeerEditingCurser,
        _setPos,
        connected,
        setConnected,
      }}
    >
      {connected && _usingPeerEditingCurser && (
        <Curser name="Smith" cursorXY={_pos} />
      )}
      {children}
    </PeerContext.Provider>
  );
};

export const usePeers = () => {
  const ctx = useContext(PeerContext);
  if (!ctx) {
    throw new Error("must wrap app in a Peer Context Provider");
  }
  return ctx;
};
