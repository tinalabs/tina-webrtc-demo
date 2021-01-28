import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import SimplePeer, { Instance } from "simple-peer";
import { TinaCMS } from "tinacms";
import { Curser } from "../curser/Cursor";
import { postData } from "../util";

const PeerContext = React.createContext(
  (undefined as unknown) as {
    peer: Instance;
    setPeer: React.Dispatch<React.SetStateAction<Instance>>;
    setFirstPeer: React.Dispatch<React.SetStateAction<boolean>>;
    _setPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    _setUsingPeerEditingCurser: React.Dispatch<React.SetStateAction<boolean>>;
    firstPeer: boolean;
    connected: boolean;
    setConnected: React.Dispatch<React.SetStateAction<boolean>>;
    connectedRef: React.MutableRefObject<boolean>;
  }
);

export interface PeerProviderConfig {
  shareSideBar: boolean;
}
export const PeerProvider: React.FC<{
  cms?: TinaCMS;
  config: PeerProviderConfig;
}> = ({ children, cms, config }) => {
  const ssr = typeof window == "undefined";
  const secondPeer = ssr ? true : location.hash === "#1";
  const temp = useMemo(() => {
    return ssr
      ? ((undefined as unknown) as SimplePeer.Instance)
      : new SimplePeer({
          initiator: !secondPeer,
          trickle: false,
        });
  }, []);
  const [peer, setPeer] = useState<Instance>(temp);
  const [firstPeer, setFirstPeer] = useState(true);
  const [_usingPeerEditingCurser, _setUsingPeerEditingCurser] = useState(false);
  const [_pos, _setPos] = useState({ x: -100, y: -100 });
  const [connected, setConnected] = useState(false);
  const connectedRef = useRef(false);

  const p = peer;
  useEffect(() => {
    p.on("error", (err) => console.log("error", err));

    p.on("signal", (data) => {
      console.log("SIGNAL", JSON.stringify(data));
      if (data.type === "offer") {
        console.log("posting");
        postData("/api/signal?slug=/", { data, type: "offer" });
      } else if (data.type == "answer") {
        console.log("posting answer");
        postData("/api/signal?slug=/", { data, type: "answer" });
      }
    });
    p.on("connect", () => {
      console.log("CONNECT");
      connectedRef.current = true;
      setConnected(true);
    });

    const fetchOffer = async () => {
      if (secondPeer) {
        const res = await fetch("/api/signal?slug=/");
        const { offer } = await res.json();
        if (offer) {
          p.signal(offer);
        }
      }
    };
    fetchOffer();
  }, []);

  useEffect(() => {
    cms?.events.subscribe("sidebar:*", (e) => {
      if (!connectedRef.current || !config.shareSideBar) {
        return;
      }
      if (e.type === "sidebar:opened") {
        p.send(
          JSON.stringify({
            sidebar: {
              value: true,
            },
          })
        );
      }
      if (e.type === "sidebar:closed") {
        p.send(
          JSON.stringify({
            sidebar: {
              value: false,
            },
          })
        );
      }
    });
  });

  return (
    <PeerContext.Provider
      value={{
        peer: p,
        setPeer,
        firstPeer,
        setFirstPeer,
        _setUsingPeerEditingCurser,
        _setPos,
        connected,
        setConnected,
        connectedRef: connectedRef,
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
