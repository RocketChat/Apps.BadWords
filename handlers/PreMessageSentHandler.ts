import {
    IHttp,
    IMessageBuilder,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import { IMessage } from "@rocket.chat/apps-engine/definition/messages";
import { clean } from "../lib/Messages";
export class PreMessageSentHandler {
    constructor(
        private app: IApp,
        private message: IMessage,
        private builder: IMessageBuilder,
        private read: IRead,
        private http: IHttp,
        private persist: IPersistence,
        private blockedWords: Array<string>
    ) {}

    public async run() {
        if (this.blockedWords.length == 0) {
            return this.message;
        }

        const { text = "", room, sender } = this.message;
        const { cleanText, isAnyWordProfane } = clean(this.blockedWords, text);

        if (!isAnyWordProfane) {
            return this.message;
        }

        const cleanMessage = this.builder
            .setText(cleanText)
            .setRoom(room)
            .setSender(sender);

        return cleanMessage.getMessage();
    }
}
