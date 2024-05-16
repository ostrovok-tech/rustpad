import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import init, { set_panic_hook } from "rustpad-wasm";
import App from "./App";
import "./index.css";

// This is important to avoid requests to jsDelivr and other external CDNs
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
loader.config({ monaco });

init().then(() => {
  set_panic_hook();
  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById("root"),
  );
});
