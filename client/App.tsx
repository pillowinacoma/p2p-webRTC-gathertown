import * as React from "react";
// Import de l'image
import LOGO from "./logo.png";

export interface HelloWorldProps {
  userName: string;
  lang: string;
}
export const App = (props: HelloWorldProps) => (
  <>
  <h1>
    Hi {props.userName} from React! Welcome to {props.lang}!
  </h1>
  <img src={LOGO} alt="Logo" />;
  </>
);