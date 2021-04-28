import React from "react";
import ContentLoader from "react-content-loader";

const Loader = (props) => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#787878"
    foregroundColor="#454545"
    {...props}
  >
    <rect x="0" y="3" rx="8" ry="8" width="208" height="13" />
    <rect x="343" y="90" rx="0" ry="0" width="0" height="3" />
    <rect x="0" y="22" rx="0" ry="0" width="380" height="34" />
    <rect x="0" y="63" rx="8" ry="8" width="380" height="94" />
  </ContentLoader>
);

export default Loader;
