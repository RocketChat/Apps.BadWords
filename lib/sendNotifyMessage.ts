import { INotifier } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export async function sendNotifyMessage(
    room: IRoom,
    user: IUser,
    threadId: string | undefined,
    notify: INotifier,
    message: string
) {
    const builder = notify.getMessageBuilder();

    builder
        .setRoom(room)
        .setUsernameAlias("Bad Words Moderator")
        .setText(message);

    if (threadId) {
        builder.setThreadId(threadId);
    }

    await notify.notifyUser(user, builder.getMessage());
}
