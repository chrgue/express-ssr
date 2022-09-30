import express, { Express } from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import path from 'path';
import { html, Module } from './html';
import "../../.env";

dotenv.config();

const app: Express = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './templates'))

app.use(compression())
app.use("/static", express.static(__dirname + '/public'))

const setupRoutes = () => {
    const cache: { [key: string]: Module<any> } = {};
    const importAll = (r: __WebpackModuleApi.RequireContext) => {
        r.keys().forEach((key) => (cache[key] = r(key)));
    };

    importAll(require.context('./pages/', true, /.tsx?$/));

    Object
        .entries(cache)
        .forEach(([modulePath, module]) => {
            const urlPattern = modulePath.split('.')[1];
            const appId = urlPattern.slice(1);
            const handler = html(module, appId);
            app.use(urlPattern, handler);
        });
};

const importTemplates = () => {
    const templates = require.context('./templates/', true, /.ejs$/)
    templates.keys().forEach((key) => (templates(key)))
};

importTemplates();
setupRoutes();

export { app as default };