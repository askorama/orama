
export type GithubStars = {
    user: string;
    repo: string;
    size: string;
}

export type YoutubeProps = {
    embedId: string;
}

export type DemoButtonProps = {
    link: string;
}

export type clickedButton = () => void;

export type PokedexObject = {
    id: number;
    name: {
        english: string;
        japanese: string;
        french: string;
        chinese: string;
    },
    type: string[];
    base: {
        HP: number;
        Attack: number;
        Defense: number;
        "Sp. Attack": number;
        "Sp. Defense": number;
        Speed: number;
    }
}

export type LyraResult = {
    count: number;
    hits: any[];
    elapsed: string;
}