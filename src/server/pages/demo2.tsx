import { Request } from "express";
import React, { useEffect } from 'react';
import UIExample from '../../components/Example/Example';

export function getProps(request: Request) {
    return { name: request.query.name };
}

export default (props: ReturnType<typeof getProps>) => {
    useEffect(() => console.log("Hello from Page's useEffect!"));
    return <UIExample text={props.name?.toString() || 'default'}/>;
};