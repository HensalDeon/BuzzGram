// import LogoSearch from "../../components/LogoSearch/LogoSearch";
import "./Chat.scss";

function Chat() {
    return (
        <div className="Chat">
            <div className="Left-side-chat">
                <div className="Chat-container">
                    <h2>Chats</h2>
                    {/* <LogoSearch /> */}
                    <div className="Chat-list">conversations</div>
                </div>
            </div>
            <div className="Right-side-chat">righty side</div>
        </div>
    );
}

export default Chat;
