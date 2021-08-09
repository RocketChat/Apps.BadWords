import {
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";

export async function showModal(
    room: IRoom,
    read: IRead,
    modify: IModify
): Promise<IUIKitModalViewParam> {
    const block = modify.getCreator().getBlockBuilder();

    const roomAssociation = new RocketChatAssociationRecord(
        RocketChatAssociationModel.ROOM,
        room.id
    );
    const records = await read
        .getPersistenceReader()
        .readByAssociation(roomAssociation);
        
    if (records.length == 0) {
        block.addContextBlock({
            elements: [
                block.newPlainTextObject(
                    `No data found for Room - ${room.displayName}`
                ),
            ],
        });
    } else {
        console.log("The data is = ", records);
    }

    return {
        id: room.id,
        title: block.newPlainTextObject("This is test"),
        close: block.newButtonElement({
            text: block.newPlainTextObject("Cancel"),
        }),
        blocks: block.getBlocks(),
    };
}
