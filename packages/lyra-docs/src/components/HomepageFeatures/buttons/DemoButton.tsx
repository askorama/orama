import { clickedButton } from '@site/utils/types';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import styles from './buttons.module.css';

const DemoButton: any = (): JSX.Element => {
    const targetEl = document.querySelector('.demo');
    // Show demo logic
    const [showDemo, setShowDemo] = useState<boolean>(false);
    const clicked: clickedButton = (): void => {
        setShowDemo(!showDemo);
    }

    return (
        <button className={clsx("button button--secondary button--lg", styles.demoButton)}
            onClick={clicked}
        >
            <span className="btn-text">Demo</span>
        </button>
    );
}

export default DemoButton;