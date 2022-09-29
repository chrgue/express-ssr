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

let a: any = undefined


const path1 = path.resolve(__dirname, "public");
fs.readdir(path1, (err, files) => {
    a = (files || [])
        .filter(it => path.basename(it).endsWith("-manifest.json"))
        .reduce((prev, curr) => {
            let text: any = fs.readFileSync(path1 + "/" + curr);
            const a: any = curr.split("-")[0]
            // @ts-ignore
            prev[a!] = JSON.parse(text)
            return prev;
        }, {});
});

function getResource(moduleId: string, ext: string) {
    const aElement = a[moduleId];

    return Object.keys(aElement)
        .filter((it) => it.endsWith(ext))
        .map((it) => aElement[it])
}

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
            js: getResource(name, ".js"),
            css: getResource(name, ".css")
        })
    }
}