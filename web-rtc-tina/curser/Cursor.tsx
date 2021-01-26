import React, { useEffect, useState } from "react";
// import { PeerManager, setPosProps } from "../webrtc";
import Portal from "./Portal";

export const Curser: React.FC<{
  name: string;
  cursorXY: { x: number; y: number };
}> = ({ cursorXY }) => {
  const clientID = "curser";
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
        {/* {name} */}
      </div>
    </Portal>
  );
};
