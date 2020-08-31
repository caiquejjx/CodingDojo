import styled from "styled-components";

import DojoLogo from "../../assets/dojo_logo.png";

export const Container = styled.div`
  color: black;
  padding: 20px 10px;
  max-width: 200px;
`;

export const Logo = styled.div`
  display: flex;
`;

export const Icon = styled.img.attrs({
  src: DojoLogo,
  alt: "Dojo logo",
})`
  margin-left: 10px;
  width: 120px;
`;
