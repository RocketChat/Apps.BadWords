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
import { banUser, clearStats, unBanUser } from "../lib/storeStats";

export class BadWordsCommand implements ISlashCommand {
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
            const args = context.getArguments();
            console.log("the args are = ", args);
            switch (args[0]) {
                case "stats": {
                    if (triggerId) {
                        const modal = await showModal(room, read, modify);
                        await modify
                            .getUiController()
                            .openModalView(modal, { triggerId }, sender);
                    } else {
                        sendNotifyMessage(
                            room,
                            sender,
                            threadId,
                            modify.getNotifier(),
                            "Something went wrong!!"
                        );
                    }
                    break;
                }

                case "clear": {
                    if (args[1]) {
                        const username = args[1];
                        const user = await read
                            .getUserReader()
                            .getByUsername(username);
                        if (user) {
                            clearStats(room.id, user.id, persis, read);
                            sendNotifyMessage(
                                room,
                                sender,
                                threadId,
                                modify.getNotifier(),
                                `*${user.username}'s* record has been cleared`
                            );
                        } else {
                            sendNotifyMessage(
                                room,
                                sender,
                                threadId,
                                modify.getNotifier(),
                                "User not found! Please enter a valid username."
                            );
                        }
                    } else {
                        sendNotifyMessage(
                            room,
                            sender,
                            threadId,
                            modify.getNotifier(),
                            "Please provide a username after clear keyword!"
                        );
                    }
                    break;
                }

                case "ban": {
                    if (args[1]) {
                        const username = args[1];
                        const user = await read
                            .getUserReader()
                            .getByUsername(username);
                        if (user) {
                            banUser(room.id, user.id, persis, read);
                            sendNotifyMessage(
                                room,
                                sender,
                                threadId,
                                modify.getNotifier(),
                                `*${user.username}* has been banned from this room!`
                            );
                        } else {
                            sendNotifyMessage(
                                room,
                                sender,
                                threadId,
                                modify.getNotifier(),
                                "User not found! Please enter a valid username."
                            );
                        }
                    } else {
                        sendNotifyMessage(
                            room,
                            sender,
                            threadId,
                            modify.getNotifier(),
                            "Please provide a username after ban keyword!"
                        );
                    }
                    break;
                }

                case "unban": {
                    if (args[1]) {
                        const username = args[1];
                        const user = await read
                            .getUserReader()
                            .getByUsername(username);
                        if (user) {
                            unBanUser(room.id, user.id, persis, read);
                            sendNotifyMessage(
                                room,
                                sender,
                                threadId,
                                modify.getNotifier(),
                                `*${user.username}* has been un-banned from this room!`
                            );
                        } else {
                            sendNotifyMessage(
                                room,
                                sender,
                                threadId,
                                modify.getNotifier(),
                                "User not found! Please enter a valid username."
                            );
                        }
                    } else {
                        sendNotifyMessage(
                            room,
                            sender,
                            threadId,
                            modify.getNotifier(),
                            "Please provide a username after unban keyword!"
                        );
                    }
                    break;
                }
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
