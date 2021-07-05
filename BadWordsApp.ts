import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IMessageBuilder,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import {
    IMessage,
    IPreMessageSentModify,
} from "@rocket.chat/apps-engine/definition/messages";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
import { Settings } from "./config/Settings";
import { CheckPreMessageSentHandler } from "./handlers/CheckPreMessageSentHandler";
import { OnSettingsUpdatedHandler } from "./handlers/OnSettingsUpdatedHandler";
import { PreMessageSentHandler } from "./handlers/PreMessageSentHandler";
import { getBlockedWords } from "./lib/Settings";
export class BadWordsApp extends App implements IPreMessageSentModify {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public blockedWords: Array<string>;

    async checkPreMessageSentModify(
        message: IMessage,
        read: IRead,
        http: IHttp
    ): Promise<boolean> {
        const checkPreMessageSentHandler = new CheckPreMessageSentHandler(
            this,
            message,
            read,
            http,
            this.blockedWords
        );
        return checkPreMessageSentHandler.check();
    }

    async executePreMessageSentModify(
        message: IMessage,
        builder: IMessageBuilder,
        read: IRead,
        http: IHttp,
        persist: IPersistence
    ): Promise<IMessage> {
        const preMessageHandler = new PreMessageSentHandler(
            this,
            message,
            builder,
            read,
            http,
            persist,
            this.blockedWords
        );
        return preMessageHandler.run();
    }

    public async onSettingUpdated(
        setting: ISetting,
        configurationModify: IConfigurationModify,
        read: IRead,
        http: IHttp
    ): Promise<void> {
        const settingsUpdated = new OnSettingsUpdatedHandler(
            this,
            setting,
            configurationModify,
            read,
            http
        );
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
        this.blockedWords = await getBlockedWords(
            environmentRead,
            this.getAccessors().http
        );
    }
}
