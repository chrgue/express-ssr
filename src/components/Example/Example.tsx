import { useEffect } from "react";
import styles from "./example.scss";

const UIExample = ({ text }: { text: string }) => {
    useEffect(() => console.log("Hello from Example's useEffect"), [])

    return (
        <div className={styles.example}>
            <h1 className={styles.example__heading}>Example: {text}</h1>
        </div>
    );
};

export default UIExample;