import {
    IEnvironmentRead,
    IHttp,
} from "@rocket.chat/apps-engine/definition/accessors";
import { AppSetting } from "../config/Settings";

export const getBlockedWords = async (
    environmentRead: IEnvironmentRead,
    http: IHttp
) => {
    const badWordsURL: string = await environmentRead
        .getSettings()
        .getValueById(AppSetting.LinkToExtractBadWords);

    const listOfBlockedWordsSetting: string = await environmentRead
        .getSettings()
        .getValueById(AppSetting.ListOfBlockedWords);

    const listOfAllowedWordsSetting: string = await environmentRead
        .getSettings()
        .getValueById(AppSetting.ListOfAllowededWords);

    const listOfAllowedWords: Array<string> = listOfAllowedWordsSetting
        .split(",")
        .map((word) => word.trim());

    const blockedWordsFromSettings: Array<string> = listOfBlockedWordsSetting
        .split(",")
        .map((word) => word.trim());

    const fetchBlockedWordsFromURL = await http.get(badWordsURL);
    const blockedWordsFromURL = JSON.parse(
        fetchBlockedWordsFromURL.content || "{}"
    );
    const blockedWords: Array<string> = blockedWordsFromURL.words;
    blockedWords.push(...blockedWordsFromSettings);

    listOfAllowedWords.map((word) => {
        const idx = blockedWords.indexOf(word);
        if (idx > -1) {
            blockedWords.splice(idx, 1);
        }
    });

    return blockedWords;
};

export const getSettingValue = async (
    environmentRead: IEnvironmentRead,
    id: string
) => {
    return await (
        await environmentRead.getSettings().getById(id)
    ).value;
};
