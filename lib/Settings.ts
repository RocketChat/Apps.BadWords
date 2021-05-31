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

    const fetchBlockedWordsFromURL = await http.get(badWordsURL);
    const blockedWordsFromURL = JSON.parse(
        fetchBlockedWordsFromURL.content || "{}"
    );
    const blockedWords: Array<string> = blockedWordsFromURL.words;

    const blockedWordsFromSettings: Array<string> = listOfBlockedWordsSetting
        .split(",")
        .map((word) => word.trim());
    blockedWords.push(...blockedWordsFromSettings);
    return blockedWords;
};
