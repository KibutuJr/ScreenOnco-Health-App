import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Logo from "../assets/logo.svg";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! I’m your Patient Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a friendly medical site assistant. Welcome visitors, offer insights about the site, and help with booking, education, or general info.",
            },
            ...messages.map((m) => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: userMsg.text },
          ],
        }),
      });
      const data = await resp.json();
      const botText =
        data.choices?.[0]?.message?.content?.trim() || "Sorry, I hit a snag.";

      setMessages((m) => [...m, { from: "bot", text: botText }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { from: "bot", text: "❌ Oops, something went wrong." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Open toggle button, hide when chat is open */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full shadow-2xl text-white focus:outline-none"
          aria-label="Open chat"
        >
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-20 sm:right-6 z-40 w-full sm:w-80 h-1/2 sm:h-96 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header with inline close button */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center p-1">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-white font-semibold">
                  Patient Assistant
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white focus:outline-none"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-2 overflow-y-auto space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-end ${
                    m.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.from === "bot" && (
                    <div className="h-6 w-6 mr-2 bg-blue-100 rounded-full flex items-center justify-center p-1">
                      <img
                        src={Logo}
                        alt="Logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-xl whitespace-pre-wrap break-words ${
                      m.from === "user"
                        ? "bg-indigo-100 text-indigo-800 rounded-br-none"
                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.from === "user" && (
                    <div className="h-6 w-6 ml-2 bg-indigo-200 rounded-full" />
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center animate-pulse p-1">
                    <img
                      src={Logo}
                      alt="Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
