import React from "react";
// @ts-ignore
import Module from 'module';
import { hydrateRoot } from 'react-dom/client';

declare global {
    // defined in webpack.config.js
    const MODULE_ID: string
}

function initialize(appId: string) {
    const elementId = `${appId}-component`;
    const dataElementId = `__${appId.toUpperCase()}_DATA__`
    const element = document.getElementById(elementId);
    const dataElement = document.getElementById(dataElementId);
    const data = JSON.parse(dataElement?.textContent!);

    if (element) {
        // @ts-ignore
        const component = <Module {...data}/>;
        hydrateRoot(element, component);
    } else {
        console.error("can not find element for hydration", elementId)
    }
}

initialize(MODULE_ID);

