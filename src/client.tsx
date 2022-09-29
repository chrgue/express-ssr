import React from "react";
import { hydrateRoot } from 'react-dom/client';
// @ts-ignore
import Module from '__MODULE__';

declare global {
    // defined in webpack.config.js
    const __MODULE_ID__: string
}

function initialize(appId: string) {
    const elementId = `${appId}-component`;
    const dataElementId = `__${appId.toUpperCase()}_DATA__`
    const element = document.getElementById(elementId);
    const dataElement = document.getElementById(dataElementId);
    const data = dataElement && JSON.parse(dataElement.textContent!);

    if (element) {
        // @ts-ignore
        const component = <Module {...data}/>;
        hydrateRoot(element, component);
    } else {
        console.error("can not find element for hydration", elementId)
    }
}

initialize(__MODULE_ID__);

