import {
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { UIKitBlockInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { banUser, clearStats, unBanUser } from "../lib/storeStats";

export class BlockActionHandler {
    constructor(
        private context: UIKitBlockInteractionContext,
        private read: IRead,
        private persist: IPersistence
    ) {}

    public async run() {
        const data = this.context.getInteractionData();
        const { actionId, value } = data;

        const args = value?.split(".");
        const rid = args && args[0];
        const uid = args && args[1];

        switch (actionId) {
            case "clear": {
                clearStats(rid || "", uid || "", this.persist, this.read);
                return {
                    success: true,
                };
            }

            case "ban": {
                banUser(rid || "", uid || "", this.persist, this.read);
                return {
                    success: true,
                };
            }

            case "unban": {
                unBanUser(rid || "", uid || "", this.persist, this.read);
                return {
                    success: true,
                };
            }
        }

        return {
            success: false,
        };
    }
}
