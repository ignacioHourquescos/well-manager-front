import React from "react";
import { Inner } from "./styles";

const Typo = ({ children, ...restProps }) => (
  <Inner {...restProps}>{children}</Inner>
);

export default Typo;
