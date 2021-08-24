import { IHttp, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { AppSetting } from "../config/Settings";
import { getSettingValue } from "../lib/Settings";

export class CheckPreMessageSentHandler {
    constructor(
        private app: IApp,
        private message: IMessage,
        private read: IRead,
        private http: IHttp,
        private blockedWords: Array<string>
    ) {}

    private async checkForChannels(room: IRoom): Promise<boolean> {
        const { displayName: roomName } = room;

        const applyToAllChannels = await getSettingValue(
            this.read.getEnvironmentReader(),
            AppSetting.ApplyFilterToAllChannels
        );

        if (applyToAllChannels) {
            const excludedChannels = (
                await getSettingValue(
                    this.read.getEnvironmentReader(),
                    AppSetting.ExcludeChannels
                )
            )
                .split(",")
                .map((e: string) => e.trim());
            return !excludedChannels.includes(roomName);
        } else {
            const includedChannels = (
                await getSettingValue(
                    this.read.getEnvironmentReader(),
                    AppSetting.IncludeChannels
                )
            )
                .split(",")
                .map((e) => e.trim());
            return includedChannels.includes(roomName);
        }
    }

    public async check(): Promise<boolean> {
        if (this.blockedWords.length == 0) return false;

        const { room, sender } = this.message;
        const { type } = room;

        switch (type) {
            case "d":
                return await getSettingValue(
                    this.read.getEnvironmentReader(),
                    AppSetting.ApplyFilterToDirectMessages
                );
            case "l":
                return await getSettingValue(
                    this.read.getEnvironmentReader(),
                    AppSetting.ApplyFilterToLivechatMessages
                );
            default:
                return this.checkForChannels(room);
        }
    }
}
