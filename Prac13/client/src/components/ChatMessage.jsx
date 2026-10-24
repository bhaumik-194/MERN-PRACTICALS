
export default function ChatMessage({ message, isOwn }) {
  return (
    <article className={`message-row ${isOwn ? "message-own" : ""}`}>
      <div className="message-bubble">
        {!isOwn && (
          <span className="message-author">{message.username}</span>
        )}

        <p>{message.text}</p>

        <time>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </article>
  );
}
