import React from 'react';
import { Example } from '../../components';

export function getProps() {
    return { name: 'Phoenix' };
}

export default (props: ReturnType<typeof getProps>) => {
    return <Example text={props.name.toString()}/>;
};