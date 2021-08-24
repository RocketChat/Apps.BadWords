let regex = /[^a-zA-Z0-9|\$|\@]|\^/g;
let splitRegex = /\b/;
let placeHolder = "*";
let replaceRegex = /\w/g;
let exclude: Array<string> = [];

const isProfane = (blockedWords: Array<string>, string: string): boolean => {
    return (
        blockedWords.filter((word) => {
            const wordExp = new RegExp(
                `\\b${word.replace(/(\W)/g, "\\$1")}\\b`,
                "gi"
            );
            return (
                !exclude.includes(word.toLowerCase()) && wordExp.test(string)
            );
        }).length > 0 || false
    );
};

const replaceWord = (string: string): string => {
    return string.replace(regex, "").replace(replaceRegex, placeHolder);
};

export const clean = (blockedWords: Array<string>, string: string) => {
    let isAnyWordProfane = false;
    let cleanText: string = string
        .split(splitRegex)
        .map((word) => {
            if (isProfane(blockedWords, word)) {
                isAnyWordProfane = true;
                word = replaceWord(word);
            }
            return word;
        })
        .join(splitRegex.exec(string)![0]);
    return { isAnyWordProfane, cleanText };
};
