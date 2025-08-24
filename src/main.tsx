import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { ConfigProvider, App as AntApp } from "antd";
import { getStore, history } from "@/app/store";
import App from "./App";
import "antd/dist/reset.css";

const store = getStore();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <AntApp>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </AntApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
