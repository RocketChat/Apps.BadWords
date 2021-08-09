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
import { showModal } from "../lib/showModal";

export class TestCommand implements ISlashCommand {
    public command = "testing";
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

        const args = context.getArguments();
        console.log("Arsga re = ", args);

        const room = context.getRoom();

        if (triggerId) {
            const modal = await showModal(room, read, modify);
            await modify
                .getUiController()
                .openModalView(modal, { triggerId }, context.getSender());
        }
    }
}
