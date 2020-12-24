import { MessageReaction, User } from "discord.js";
import { EventActions, RegisteredEventAction } from "../../../commandFramework";


@RegisteredEventAction
export class OnReactionTest extends EventActions.MessageReactionAddAction {

    action(messageReaction: MessageReaction, user: User): void {
        this.logger.debug("OnReactionTest executed!")
    }

}

