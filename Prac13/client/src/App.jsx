
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  MessageCircle,
  Send,
  Users,
  Wifi,
  WifiOff,
  LogOut,
} from "lucide-react";
import ChatMessage from "./components/ChatMessage";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export default function App() {
  const [usernameInput, setUsernameInput] = useState("");
  const [username, setUsername] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!username) return;

    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    socketRef.current = socket;

    const joinChat = () => {
      socket.emit("join_chat", username, (response) => {
        if (!response?.success) {
          setError(response?.message || "Unable to join the chat");
          return;
        }

        setConnected(true);
        setJoining(false);
        setError("");
      });
    };

    socket.on("connect", joinChat);

    socket.on("connect_error", () => {
      setConnected(false);
      setJoining(false);
      setError("Cannot connect to the server. Check that it is running.");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("chat_history", (history) => {
      setMessages(
        history.map((message) => ({
          ...message,
          type: "message",
        }))
      );
    });

    socket.on("receive_message", (message) => {
      setMessages((current) => [
        ...current,
        { ...message, type: "message" },
      ]);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user_joined", (event) => {
      setMessages((current) => [
        ...current,
        {
          id: `join-${Date.now()}-${Math.random()}`,
          type: "system",
          text: event.message,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on("user_left", (event) => {
      setMessages((current) => [
        ...current,
        {
          id: `leave-${Date.now()}-${Math.random()}`,
          type: "system",
          text: event.message,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [username]);

  const handleJoin = (event) => {
    event.preventDefault();

    const cleanName = usernameInput.trim();

    if (!cleanName || cleanName.length > 30) {
      setError("Enter a username between 1 and 30 characters.");
      return;
    }

    setError("");
    setJoining(true);
    setMessages([]);
    setOnlineUsers([]);
    setUsername(cleanName);
  };

  const handleSend = (event) => {
    event.preventDefault();

    const text = messageInput.trim();

    if (!text || !socketRef.current || !connected) return;

    if (text.length > 1000) {
      setError("Messages cannot exceed 1000 characters.");
      return;
    }

    socketRef.current.emit("send_message", text, (response) => {
      if (!response?.success) {
        setError(response?.message || "Unable to send message");
      } else {
        setError("");
      }
    });

    setMessageInput("");
    messageInputRef.current?.focus();
  };

  const handleLeave = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setUsername("");
    setUsernameInput("");
    setMessageInput("");
    setMessages([]);
    setOnlineUsers([]);
    setConnected(false);
    setJoining(false);
    setError("");
  };

  if (!username) {
    return (
      <main className="join-screen">
        <section className="join-card">
          <div className="app-icon">
            <MessageCircle size={30} />
          </div>

          <p className="eyebrow">REAL-TIME MESSAGING</p>
          <h1>Let's talk.</h1>
          <p className="subtitle">
            Join the room and start a conversation instantly.
          </p>

          <form onSubmit={handleJoin} className="join-form">
            <label htmlFor="username">Your username</label>
            <input
              id="username"
              value={usernameInput}
              onChange={(event) => setUsernameInput(event.target.value)}
              placeholder="Enter your name"
              maxLength={30}
              autoComplete="nickname"
              autoFocus
              required
            />

            {error && <p className="error-message">{error}</p>}

            <button
              type="submit"
              className="primary-button"
              disabled={joining}
            >
              {joining ? "Connecting..." : "Join Chat"}
              <MessageCircle size={18} />
            </button>
          </form>

          <p className="join-note">
            No account needed. Choose a username to enter.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="chat-app">
      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
          <span className="brand-icon">
            <MessageCircle size={22} />
          </span>
          <span>ChatSpace</span>
        </a>

        <div className="connection-status">
          {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span>{connected ? "Connected" : "Reconnecting..."}</span>
        </div>

        <button
          type="button"
          className="leave-button"
          onClick={handleLeave}
        >
          <LogOut size={17} />
          <span>Leave</span>
        </button>
      </header>

      <div className="chat-layout">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <div>
              <p className="eyebrow">YOUR SPACE</p>
              <h2>General Chat</h2>
            </div>
            <span className="room-dot" />
          </div>

          <p className="room-description">
            A shared room for real-time conversations.
          </p>

          <div className="online-heading">
            <Users size={17} />
            <span>Online members</span>
            <span className="online-count">{onlineUsers.length}</span>
          </div>

          <div className="user-list">
            {onlineUsers.map((name, index) => (
              <div
                className="online-user"
                key={`${name}-${index}`}
              >
                <span className="avatar">
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className="online-name">
                  {name}{name === username ? " (You)" : ""}
                </span>
                <span className="user-dot" />
              </div>
            ))}
          </div>

          <div className="current-user">
            <span className="avatar current-avatar">
              {username.charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{username}</strong>
              <span>Chat participant</span>
            </div>
          </div>
        </aside>

        <section className="chat-panel">
          <div className="chat-heading">
            <div>
              <h1>General conversation</h1>
              <p>Messages appear instantly for everyone online.</p>
            </div>
            <span className="live-badge">
              <span className="user-dot" />
              LIVE
            </span>
          </div>

          <div
            className="message-list"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.length === 0 && (
              <div className="empty-chat">
                <div className="empty-icon">
                  <MessageCircle size={28} />
                </div>
                <h2>It's quiet in here.</h2>
                <p>Send the first message to get things started.</p>
              </div>
            )}

            {messages.map((message) =>
              message.type === "system" ? (
                <div className="system-message" key={message.id}>
                  <span>{message.text}</span>
                </div>
              ) : (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={message.username === username}
                />
              )
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && <p className="chat-error">{error}</p>}

          <form className="message-form" onSubmit={handleSend}>
            <input
              ref={messageInputRef}
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              placeholder={
                connected ? "Write a message..." : "Waiting for connection..."
              }
              maxLength={1000}
              aria-label="Message"
              disabled={!connected}
              autoComplete="off"
            />

            <button
              type="submit"
              className="send-button"
              disabled={!connected || !messageInput.trim()}
              aria-label="Send message"
            >
              <Send size={19} />
              <span>Send</span>
            </button>
          </form>

          <p className="input-hint">Press Enter to send · 1000 characters max</p>
        </section>
      </div>
    </main>
  );
}
