import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { sendNotifyMessage } from "../lib/sendNotifyMessage";
import { showModal } from "../lib/showModal";

export class TestCommand implements ISlashCommand {
    public command = "bad-words";
    public i18nParamsExample = "example params";
    public i18nDescription = "command description";
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const triggerId = context.getTriggerId();
        const room = context.getRoom();
        const sender = context.getSender();
        const threadId = context.getThreadId();

        if (sender.roles.includes("admin") || sender.roles.includes("owner")) {
            if (triggerId) {
                const modal = await showModal(room, read, modify);
                await modify
                    .getUiController()
                    .openModalView(modal, { triggerId }, sender);
                console.log("After UI MODAL");
            } else {
                sendNotifyMessage(
                    room,
                    sender,
                    threadId,
                    modify.getNotifier(),
                    "Something went wrong!!"
                );
            }
        } else {
            sendNotifyMessage(
                room,
                sender,
                threadId,
                modify.getNotifier(),
                "This slash command can be only used by admins and owners"
            );
        }
    }
}
