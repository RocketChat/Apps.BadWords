import { IRead } from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

export async function getStatsForOffendingUser(
    rid: string,
    uid: string,
    read: IRead
) {
    const roomAssociation = new RocketChatAssociationRecord(
        RocketChatAssociationModel.ROOM,
        rid
    );
    const userAssociation = new RocketChatAssociationRecord(
        RocketChatAssociationModel.USER,
        uid
    );

    const [record] = await read
        .getPersistenceReader()
        .readByAssociations([roomAssociation, userAssociation]);

    return record;
}

export async function getStatsForRoom(rid: string, read: IRead) {
    const roomAssociation = new RocketChatAssociationRecord(
        RocketChatAssociationModel.ROOM,
        rid
    );

    const [record] = await read
        .getPersistenceReader()
        .readByAssociation(roomAssociation);

    return record;
}
