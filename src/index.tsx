import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import init, { set_panic_hook } from "rustpad-wasm";
import App from "./App";
import "./index.css";

// This is important to avoid requests to jsDelivr and other external CDNs
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });
loader.init().then((monaco) => {
  console.log("Monaco initialized");
});

const container = document.getElementById("root");
const root = createRoot(container);

init().then(() => {
  set_panic_hook();
  root.render(
    <StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </StrictMode>,
  );
});
