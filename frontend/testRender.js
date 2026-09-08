import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Home from './src/pages/Home.jsx';

try {
  renderToString(<StaticRouter><Home /></StaticRouter>);
  console.log("Render successful");
} catch (e) {
  console.error("Render failed:", e);
}
