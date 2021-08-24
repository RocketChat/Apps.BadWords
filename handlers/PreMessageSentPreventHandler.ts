import { IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { AppSetting } from "../config/Settings";
import { getStatsForOffendingUser } from "../lib/getStats";
import { sendNotifyMessage } from "../lib/sendNotifyMessage";
import { getSettingValue } from "../lib/Settings";

export class PreMessageSentPreventHandler {
    constructor(private message: IMessage, private read: IRead) {}

    public async run() {
        const { room, sender } = this.message;

        const record: any = await getStatsForOffendingUser(
            room.id,
            sender.id,
            this.read
        );
        const badWordsCount = record.badWordsCount;
        const badWordsLimit = await getSettingValue(
            this.read.getEnvironmentReader(),
            AppSetting.BanUserAfterThisLimit
        );
        const banned = record.banned;

        if (badWordsLimit === 0 || badWordsLimit > badWordsCount) {
            return false;
        }

        sendNotifyMessage(
            room,
            sender,
            this.message.threadId,
            this.read.getNotifier(),
            `*${sender.username}*, You are banned from this channel for using harsh language! You cannot send anymore messages in this channel until and unless you are unbanned by the admin or the owner.`
        );

        return true;
    }
}
