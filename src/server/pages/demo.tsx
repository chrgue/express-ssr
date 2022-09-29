import React from 'react';
import UIExample from '../../components';

export function getProps() {
    return { name: 'Phoenix' };
}

export default (props: ReturnType<typeof getProps>) => {
    return <UIExample text={props.name.toString()}/>;
};