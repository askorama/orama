import React from 'react';

// utils
import { GithubStars } from '@site/utils/types';

const GithubStarsButton = ({ user, repo, size }: GithubStars): JSX.Element => {
    return (
        <iframe src={`https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=star&count=true&size=${size} `}
            width="160px"
            height="30px"
        >
        </iframe>
    )
}

export default GithubStarsButton;