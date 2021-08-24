import {
    IConfigurationModify,
    IHttp,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
import { getBlockedWords } from "../lib/Settings";

export class OnSettingsUpdatedHandler {
    constructor(
        private readonly app: IApp,
        private readonly settings: ISetting,
        private readonly configurationModify: IConfigurationModify,
        private readonly read: IRead,
        private readonly http: IHttp
    ) {}

    public async run(): Promise<Array<string>> {
        const blockedWords = getBlockedWords(
            this.read.getEnvironmentReader(),
            this.http
        );

        return blockedWords;
    }
}
