import { ChatWindow } from "../chat/chat.component"
import { PlayerStatusComponent } from "./components/player-status/player-status.component"

import './hud.component.scss';

export const HudComponent: React.FC = () => {
    return (
        <div className="hud">
            <ChatWindow/>
            <PlayerStatusComponent/>
        </div>
    )
}