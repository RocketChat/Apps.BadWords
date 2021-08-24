import {
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { getStatsForOffendingUser } from "./getStats";

export async function storeStatsForOffendingUsers(
    { id: rid, displayName }: IRoom,
    { id: uid, username }: IUser,
    persist: IPersistence,
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
    const record: any = await getStatsForOffendingUser(rid, uid, read);

    if (!record) {
        const newRecord = {
            badWordsCount: 1,
            banned: false,
            roomName: displayName || "",
            userName: username,
            rid,
            uid,
        };
        await persist.createWithAssociations(newRecord, [
            roomAssociation,
            userAssociation,
        ]);
    } else {
        const updatedRecord = {
            badWordsCount: record.badWordsCount + 1,
            roomName: displayName || "",
            userName: username,
            rid,
            uid,
            banned: record.banned,
        };
        await persist.updateByAssociations(
            [roomAssociation, userAssociation],
            updatedRecord
        );
    }
}

export async function clearStats(
    rid: string,
    uid: string,
    persist: IPersistence,
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

    const record: any = await getStatsForOffendingUser(rid, uid, read);

    if (record) {
        const clearRecord = {
            ...record,
            badWordsCount: 0,
        };
        await persist.updateByAssociations(
            [roomAssociation, userAssociation],
            clearRecord
        );
    }
}

export async function banUser(
    rid: string,
    uid: string,
    persist: IPersistence,
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

    const record: any = await getStatsForOffendingUser(rid, uid, read);

    if (record) {
        const banRecord = {
            ...record,
            banned: true,
        };
        await persist.updateByAssociations(
            [roomAssociation, userAssociation],
            banRecord
        );
    }
}

export async function unBanUser(
    rid: string,
    uid: string,
    persist: IPersistence,
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

    const record: any = await getStatsForOffendingUser(rid, uid, read);

    if (record) {
        const banRecord = {
            ...record,
            banned: false,
        };
        await persist.updateByAssociations(
            [roomAssociation, userAssociation],
            banRecord
        );
    }
}
