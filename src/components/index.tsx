import { useEffect } from 'react';
import './hello.css';

const UIExample = ({ text }: { text: string }) => {
    useEffect(() => {
        console.log("Hello from useEffect");
    }, [])

    return (
        <div>
            <h1>Example: {text}</h1>
        </div>
    );
};

export default UIExample;