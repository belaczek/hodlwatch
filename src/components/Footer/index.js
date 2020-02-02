import React from "react";
import { Footer, Container, Content } from "bloomer";
import { APP_NAME } from "appConstants";

const AppFooter = () => (
  <Footer>
    <Container>
      <Content hasTextAlign="centered">
        <p>
          <strong>{APP_NAME}</strong> made by{" "}
          <a href="https://tomasbelada.com" target="blank">
            Tomas Belada
          </a>
        </p>
        <p>
          The source code is available on{" "}
          <a href="https://github.com/belaczek/hodlwatch" target="blank">
            GitHub
          </a>
          . Feel free to fork, raise an issue or just leave a star.
        </p>
      </Content>
    </Container>
  </Footer>
);

export default AppFooter;
