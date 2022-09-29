import { Request, Response } from 'express';
import ReactDOMServer from 'react-dom/server';
import React from 'react';
import fs from 'fs';
import path from 'path';

export type Module<T> = {
    name: string,
    getProps: (t: Request) => T,
    default: (t: T) => React.FunctionComponent
}

const manifest = fs.readFileSync(path.resolve(__dirname, "public", "assets-manifest.json"))
const manifestJson = manifest && JSON.parse(manifest.toString())
const getResource = (moduleId: string, ext: string) => manifestJson.entrypoints[moduleId].assets[ext] || [];

export function html<T>(module: Module<T>, name: string) {
    return (req: Request, res: Response) => {
        const props = module.getProps(req);
        const Component = module.default;
        // @ts-ignore
        const content = ReactDOMServer.renderToString(<Component {...props}/>);

        res.render('index', {
            content,
            dataId: `__${name.toUpperCase()}_DATA__`,
            elementId: name,
            data: JSON.stringify(props),
            js: getResource(name, "js"),
            css: getResource(name, "css")
        })
    }
}