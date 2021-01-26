import React from "react";
import { createPortal } from "react-dom";
import usePortal from "./usePortal";

/**
 * @example
 * <Portal>
 *   <p>Thinking with portals</p>
 * </Portal>
 */
const Portal: React.FC<{ id: string }> = ({ id, children }) => {
  const target = usePortal(id);
  if (typeof window == "undefined" || !target) {
    return children as JSX.Element;
  }
  return createPortal(children, target);
};

export default Portal;
