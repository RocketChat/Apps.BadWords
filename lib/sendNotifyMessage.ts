import { INotifier } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export async function sendNotifyMessage(
    room: IRoom,
    user: IUser,
    threadId: string | undefined,
    notify: INotifier
) {
    const builder = notify.getMessageBuilder();

    builder
        .setRoom(room)
        .setUsernameAlias("Bad Words Moderator")
        .setText(`*${user.username}*, Please watch your Language!`);

    if (threadId) {
        builder.setThreadId(threadId);
    }

    await notify.notifyUser(user, builder.getMessage());
}
