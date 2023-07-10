import "./MainMessages.css";
import MessageList from "../chart/chart";
import { dummyMessages } from "../chart/chart";
import ChatInput from "../ChatInput/ChartInput";

export default function MainMessages() {
  return (
    <div className="main-container">
      <div className="main-messages-tittle">
        <h3>Message</h3>
        <div className="main-messages-tittle-about">
          <div>
            <img src="https://picsum.photos/200/300" alt="message" />
          </div>
          <div className="main-messages-tittle-about-name">
            <p>name</p>
            <p>status</p>
          </div>
        </div>
      </div>
      <MessageList messages={dummyMessages} />
      <ChatInput />
    </div>
  );
}
