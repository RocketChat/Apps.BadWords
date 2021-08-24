import {
    IAppAccessors,
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IMessageBuilder,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import {
    IMessage,
    IPreMessageSentModify,
    IPreMessageSentPrevent,
    IPreMessageUpdatedModify,
} from "@rocket.chat/apps-engine/definition/messages";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { ISetting } from "@rocket.chat/apps-engine/definition/settings";
import { BadWordsCommand } from "./commands/BadWordsCommand";
import { Settings } from "./config/Settings";
import { CheckPreMessageSentHandler } from "./handlers/CheckPreMessageSentHandler";
import { OnSettingsUpdatedHandler } from "./handlers/OnSettingsUpdatedHandler";
import { PreMessageSentHandler } from "./handlers/PreMessageSentHandler";
import { getBlockedWords } from "./lib/Settings";
import { PreMessageSentPreventHandler } from "./handlers/PreMessageSentPreventHandler";
import {
    IUIKitInteractionHandler,
    IUIKitResponse,
    UIKitBlockInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { BlockActionHandler } from "./handlers/BlockActionHandler";

export class BadWordsApp
    extends App
    implements
        IPreMessageSentModify,
        IPreMessageUpdatedModify,
        IPreMessageSentPrevent,
        IUIKitInteractionHandler
{
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public blockedWords: Array<string>;

    async executePreMessageSentPrevent(
        message: IMessage,
        read: IRead
    ): Promise<boolean> {
        const preMessageSentPreventHandler = new PreMessageSentPreventHandler(
            message,
            read
        );
        return preMessageSentPreventHandler.run();
    }

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
        const preMessageSentHandler = new PreMessageSentHandler(
            this,
            message,
            builder,
            read,
            http,
            persist,
            this.blockedWords
        );
        return preMessageSentHandler.run();
    }

    async checkPreMessageUpdatedModify(
        message: IMessage,
        read: IRead,
        http: IHttp
    ): Promise<boolean> {
        const checkPreMessageUpdatedHandler = new CheckPreMessageSentHandler(
            this,
            message,
            read,
            http,
            this.blockedWords
        );
        return checkPreMessageUpdatedHandler.check();
    }

    async executePreMessageUpdatedModify(
        message: IMessage,
        builder: IMessageBuilder,
        read: IRead,
        http: IHttp,
        persist: IPersistence
    ): Promise<IMessage> {
        const preMessageUpdatedHandler = new PreMessageSentHandler(
            this,
            message,
            builder,
            read,
            http,
            persist,
            this.blockedWords
        );
        return preMessageUpdatedHandler.run();
    }

    async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persist: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        const blockActionHandler = new BlockActionHandler(
            context,
            read,
            persist
        );
        return blockActionHandler.run();
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
        await configuration.slashCommands.provideSlashCommand(
            new BadWordsCommand()
        );
        this.blockedWords = await getBlockedWords(
            environmentRead,
            this.getAccessors().http
        );
    }
}
