import { Request } from "express";
import React, { useEffect } from 'react';
import UIExample from '../../components';

export function getProps(request: Request) {
    return { name: request.query.name };
}

export default (props: ReturnType<typeof getProps>) => {
    useEffect(() => console.log("Hello from use effect!"));
    return <UIExample text={props.name?.toString() || 'default'}/>;
};