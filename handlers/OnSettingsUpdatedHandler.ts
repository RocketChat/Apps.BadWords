import { IHttp, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { AppSetting } from "../config/Settings";

export class OnSettingsUpdatedHandler {
    constructor(
        private readonly app: IApp,
        private readonly read: IRead,
        private readonly http: IHttp
    ) {}

    public async run(): Promise<Array<string>> {
        const badWordsURL: string = await this.read
            .getEnvironmentReader()
            .getSettings()
            .getValueById(AppSetting.LinkToExtractBadWords);
        const fetchBlockedWordsFromURL = await this.http.get(badWordsURL);
        const blockedWordsFromURL = JSON.parse(
            fetchBlockedWordsFromURL.content || ""
        );
        return blockedWordsFromURL.words;
    }
}
