import React, { useEffect, useState } from "react";
// import { PeerManager, setPosProps } from "../webrtc";
import Portal from "./Portal";

export const Curser: React.FC<{
  id?: string;
  canMove?: boolean;
  name: string;
  cursorXY: { x: number; y: number };
}> = ({ id, name, canMove = false, cursorXY }) => {
  const clientID: string | undefined = id ? `client-${id}` : undefined;

  // const [, setCursorXY] = useState({ x: -100, y: -100 });
  // useEffect(() => {
  //   if (!clientID || !canMove) return;
  //   // only do this if they can move. EI this is there own curser
  //   const moveCursor = (e: MouseEvent) => {
  //     const x = e.clientX - 8;
  //     const y = e.clientY - 8;
  //     setCursorXY({ x, y });
  //   };
  //   window.addEventListener("mousemove", moveCursor);
  //   return () => {
  //     window.removeEventListener("mousemove", moveCursor);
  //   };
  // }, [clientID, canMove]);

  if (!clientID) return null;
  return (
    <Portal id={clientID}>
      <div
        style={{
          position: "fixed",
          color: "black",
          left: 0,
          top: 0,
          width: "16px",
          height: "16px",
          borderRadius: "8px",
          backgroundColor: "lightblue",
          transform: `translate3d(${cursorXY.x}px, ${cursorXY.y}px, 0)`,
          zIndex: 999,
          pointerEvents: "none",
        }}
      >
        {name}
      </div>
    </Portal>
  );
};
