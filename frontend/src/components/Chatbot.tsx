import { useState } from "react";
import { generateResponse } from "../gemini";
import { MessageSquare, X } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const reply = await generateResponse(input);
      const botMsg: Message = { sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
      }}
    >
      {isOpen && (
        <div
          style={{
            width: "450px",
            maxHeight: "700px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e9ecef",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
              Ask Anything
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6c757d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={22} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              maxHeight: "500px",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#6c757d",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <MessageSquare size={48} style={{ marginBottom: "12px", opacity: 0.7 }} />
                <h4 style={{ margin: "8px 0", fontSize: "17px" }}>How can I help you today?</h4>
                <p style={{ margin: 0, fontSize: "15px" }}>
                  Ask me anything about invoices, clients, or payments.
                </p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ textAlign: m.sender === "user" ? "right" : "left" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 14px",
                      borderRadius: "16px",
                      backgroundColor: m.sender === "user" ? "#0d6efd" : "#f1f3f5",
                      color: m.sender === "user" ? "white" : "#212529",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #e9ecef",
              backgroundColor: "white",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "24px",
                  border: "1px solid #ced4da",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: "24px",
                  border: "none",
                  backgroundColor: "#0d6efd",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  opacity: input.trim() ? 1 : 0.6,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          backgroundColor: "#0d6efd",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          transition: "all 0.2s",
        }}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
