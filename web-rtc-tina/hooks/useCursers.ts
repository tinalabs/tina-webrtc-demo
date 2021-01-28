import { useEffect } from "react";
import { usePeers } from "../components";

export function useCurser(): [] {
  const { peer, _setPos, _setUsingPeerEditingCurser, connected } = usePeers();

  useEffect(() => {
    _setUsingPeerEditingCurser(true);
    const moveCursor = (e: MouseEvent) => {
      const x = e.clientX - 8;
      const y = e.clientY - 8;
      try {
        if (connected) {
          peer?.send(
            JSON.stringify({
              setPos: { x, y },
            })
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [peer, connected]);

  useEffect(() => {
    peer.on("data", (data) => {
      const parsedData = JSON.parse(data);
      if (parsedData.setPos) {
        _setPos(parsedData.setPos);
      }
    });
  }, [peer]);
  return [];
}
