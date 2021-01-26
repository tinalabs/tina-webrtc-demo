import React, { useContext, useEffect, useState } from "react";
import Peer from "simple-peer";

const PeerContext = React.createContext(
  (undefined as unknown) as {
    peer: Peer.Instance;
    setPeer: React.Dispatch<React.SetStateAction<Peer.Instance>>;
    setFirstPeer: React.Dispatch<React.SetStateAction<boolean>>;
    firstPeer: boolean;
  }
);

export const PeerProvider: React.FC<{ initialPeer?: Peer.Instance }> = ({
  children,
}) => {
  const [peer, setPeer] = useState(
    typeof window == "undefined"
      ? ((undefined as unknown) as Peer.Instance)
      : new Peer({
          initiator: true,
          trickle: false,
        })
  );
  const [firstPeer, setFirstPeer] = useState(true);

  useEffect(() => {
    setPeer(
      new Peer({
        initiator: firstPeer,
        trickle: false,
      })
    );
  }, [firstPeer]);
  return (
    <PeerContext.Provider value={{ peer, setPeer, firstPeer, setFirstPeer }}>
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
