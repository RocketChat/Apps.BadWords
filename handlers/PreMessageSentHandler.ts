import {
    IHttp,
    IMessageBuilder,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IApp } from "@rocket.chat/apps-engine/definition/IApp";
import {
    IMessage,
    IMessageAttachment,
} from "@rocket.chat/apps-engine/definition/messages";
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

        const { text = "", room, sender, attachments = [] } = this.message;
        // const attachments = this.message.attachments as IMessageAttachment[];
        const isAttachment = attachments.length > 0;
        const messageText = text ? text : attachments[0].description;

        const { cleanText, isAnyWordProfane } = clean(
            this.blockedWords,
            messageText ? messageText : ""
        );

        if (!isAnyWordProfane) {
            return this.message;
        }

        if (isAttachment) {
            const filteredAttachment = [
                {
                    ...attachments[0],
                    description: cleanText,
                },
            ];

            const cleanAttachmentMessage = this.builder
                .setAttachments(filteredAttachment)
                .setRoom(room)
                .setSender(sender);

            return cleanAttachmentMessage.getMessage();
        }

        const cleanTextMessage = this.builder
            .setText(cleanText)
            .setRoom(room)
            .setSender(sender);

        return cleanTextMessage.getMessage();
    }
}
