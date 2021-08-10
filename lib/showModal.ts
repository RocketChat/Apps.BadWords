import {
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import { getStatsForRoom } from "./getStats";

export async function showModal(
    room: IRoom,
    read: IRead,
    modify: IModify
): Promise<IUIKitModalViewParam> {
    const block = modify.getCreator().getBlockBuilder();

    const records: any = await getStatsForRoom(room.id, read);
    console.log("Records = ", records);
    if (records.length == 0) {
        block.addContextBlock({
            elements: [
                block.newPlainTextObject(
                    `No data found for Room - ${room.displayName}`
                ),
            ],
        });
    } else {
        records.forEach((record) => {
            block.addContextBlock({
                elements: [
                    block.newMarkdownTextObject(
                        `*${record.userName}* - *${record.badWordsCount}*`
                    ),
                ],
            });
        });
    }

    return {
        id: "122121",
        title: block.newPlainTextObject(`Offending Users in ${room.displayName}`),
        close: block.newButtonElement({
            text: block.newPlainTextObject("Cancel"),
        }),
        blocks: block.getBlocks(),
    };
}
