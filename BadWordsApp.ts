import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
import { Settings } from "./config/Settings";
import { OnSettingsUpdatedHandler } from "./handlers/OnSettingsUpdatedHandler";
export class BadWordsApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public blockedWords: any;

    public async onSettingUpdated(
        setting: ISetting,
        configurationModify: IConfigurationModify,
        read: IRead,
        http: IHttp
    ): Promise<void> {
        const settingsUpdated = new OnSettingsUpdatedHandler(this, read, http);
        this.blockedWords = await settingsUpdated.run();
    }

    protected async extendConfiguration(
        configuration: IConfigurationExtend,
        environmentRead: IEnvironmentRead
    ): Promise<void> {
        await Promise.all(
            Settings.map((setting) =>
                configuration.settings.provideSetting(setting)
            )
        );
    }
}
