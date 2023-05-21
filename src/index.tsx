import 'reflect-metadata';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Workbench } from 'mo/workbench/workbench';
import { create } from 'mo/provider';

import { DemoApp } from "mo/components/table/demo"
import "./style/mo.scss";

const moInstance = create({
    extensions: [],
});

const App = () => moInstance.render(<Workbench />);
// const App = DemoApp

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
