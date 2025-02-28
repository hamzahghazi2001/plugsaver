import React from "react";

/**
 * Minimal desktop layout that doesn't override background or styling.
 * It simply wraps children in a container <div>.
 */
const DesktopLayout = ({ children, containerStyle }) => {
  return <div style={containerStyle}>{children}</div>;
};

export default DesktopLayout;
