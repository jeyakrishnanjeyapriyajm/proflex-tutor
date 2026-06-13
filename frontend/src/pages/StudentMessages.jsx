import { useState } from "react";
import { Bell, Paperclip, Search, Send, Settings, Users } from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";

const chats = [
  {
    id: "dr-chathura",
    name: "Dr. Chathura",
    lastMsg: "Your assignment looks great, but check the loop...",
    time: "10:24 AM",
    avatar: "https://picsum.photos/seed/doc/100/100",
    online: true,
  },
  {
    id: "ict-support",
    name: "ICT Support",
    lastMsg: "The workspace issue has been resolved.",
    time: "Yesterday",
    avatar: "https://picsum.photos/seed/support/100/100",
    online: false,
  },
  {
    id: "study-group-a",
    name: "Study Group A",
    lastMsg: "Who is free for a coding session tonight?",
    time: "Yesterday",
    avatar: "https://picsum.photos/seed/group/100/100",
    online: true,
  },
];

const messages = {
  "dr-chathura": [
    {
      sender: "Dr. Chathura",
      text: "Hello! I have reviewed your latest code submission for the Loop activity. You handled the logic well, but consider using a more descriptive variable name than 'i' in complex nested loops.",
      time: "10:24 AM",
      isMe: false,
    },
    {
      sender: "Me",
      text: "Thank you, Dr. Chathura! That makes sense. I will refactor it and resubmit. Should I also look into optimizing the time complexity?",
      time: "10:26 AM",
      isMe: true,
    },
  ],
  "ict-support": [
    {
      sender: "ICT Support",
      text: "The workspace issue has been resolved. Please refresh your browser and try running the C code again.",
      time: "Yesterday",
      isMe: false,
    },
    {
      sender: "Me",
      text: "Thank you. I will check it now.",
      time: "Yesterday",
      isMe: true,
    },
  ],
  "study-group-a": [
    {
      sender: "Study Group A",
      text: "Who is free for a coding session tonight? We can revise arrays and loops.",
      time: "Yesterday",
      isMe: false,
    },
    {
      sender: "Me",
      text: "I can join after 7 PM.",
      time: "Yesterday",
      isMe: true,
    },
  ],
};

const StudentMessages = () => {
  const [selectedChat, setSelectedChat] = useState("dr-chathura");
  const [draftMessage, setDraftMessage] = useState("");

  const activeChat = chats.find((chat) => chat.id === selectedChat);
  const activeMessages = messages[selectedChat] || [];

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <div className="flex h-[calc(100vh-120px)] min-h-[720px] flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white font-sans shadow-sm">
        {/* Top Header */}
        {/* <div className="z-20 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4 lg:px-8">
          <div className="relative hidden w-96 md:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-xl border border-transparent bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
            />
          </div>

          <div className="md:hidden">
            <h1 className="text-2xl font-black text-slate-900">Messages</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600"
            >
              <Bell size={20} />
            </button>

            <div className="mx-2 hidden h-8 w-px bg-slate-100 sm:block" />

            <button
              type="button"
              className="group flex items-center gap-4 rounded-2xl p-1.5 text-left transition-all hover:bg-slate-50"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black leading-tight text-slate-900 transition-colors group-hover:text-sky-600">
                  Kogulan K.
                </p>
                <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  First Year ICT
                </p>
              </div>

              <div className="h-11 w-11 overflow-hidden rounded-xl border border-sky-200 bg-sky-100 shadow-sm transition-all group-hover:ring-4 group-hover:ring-sky-600/10">
                <img
                  src="https://picsum.photos/seed/user/200/200"
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          </div>
        </div> */}

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Chat Sidebar */}
          <aside className="hidden w-80 shrink-0 flex-col border-r border-slate-100 bg-slate-50/30 md:flex">
            <div className="p-6">
              <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900">
                Messages
              </h2>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full rounded-xl border border-slate-100 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => setSelectedChat(chat.id)}
                  className={`flex w-full gap-4 border-b border-white/50 p-6 text-left transition-all ${
                    selectedChat === chat.id
                      ? "bg-white shadow-sm"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="h-12 w-12 rounded-2xl object-cover shadow-sm"
                    />

                    {chat.online && (
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-white bg-emerald-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p
                        className={`truncate font-black ${
                          selectedChat === chat.id
                            ? "text-sky-600"
                            : "text-slate-900"
                        }`}
                      >
                        {chat.name}
                      </p>

                      <span className="whitespace-nowrap text-[10px] font-black uppercase text-slate-400">
                        {chat.time}
                      </span>
                    </div>

                    <p className="truncate text-xs font-medium leading-relaxed text-slate-500">
                      {chat.lastMsg}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Active Chat Area */}
          <main className="flex min-w-0 flex-1 flex-col bg-white">
            {/* Chat Header */}
            <div className="z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 shadow-sm shadow-slate-900/[0.02] lg:px-8">
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm">
                  <img
                    src={activeChat?.avatar}
                    alt="Active Chat"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-black leading-tight text-slate-900">
                    {activeChat?.name}
                  </h2>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        activeChat?.online ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {activeChat?.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl bg-slate-50 p-2.5 text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600"
                >
                  <Users size={20} />
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-slate-50 p-2.5 text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600"
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {/* Messages Content */}
            <div className="flex-1 space-y-8 overflow-y-auto bg-slate-50/20 p-5 lg:p-8">
              <div className="text-center">
                <span className="rounded-full border border-slate-100 bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 shadow-sm">
                  Today
                </span>
              </div>

              {activeMessages.map((message, index) => (
                <div
                  key={index}
                  className={`group flex ${
                    message.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[88%] gap-4 sm:max-w-[70%] ${
                      message.isMe ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`mt-1 h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-sm ${
                        message.isMe ? "bg-sky-100" : "bg-slate-100"
                      }`}
                    >
                      {message.isMe ? (
                        <div className="flex h-full w-full items-center justify-center text-xs font-black text-sky-600">
                          KK
                        </div>
                      ) : (
                        <img
                          src={activeChat?.avatar}
                          alt="Sender"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div
                        className={`rounded-3xl p-5 text-sm font-medium leading-relaxed shadow-sm ${
                          message.isMe
                            ? "rounded-tr-none bg-sky-600 text-white"
                            : "rounded-tl-none border border-slate-100 bg-white text-slate-600"
                        }`}
                      >
                        {message.text}
                      </div>

                      <p
                        className={`text-[10px] font-black uppercase tracking-widest text-slate-400 ${
                          message.isMe ? "text-right" : "text-left"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 bg-white p-5 lg:p-8">
              <div className="group flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-slate-50 p-2 shadow-inner transition-all focus-within:border-sky-600/20 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-600/5">
                <button
                  type="button"
                  className="rounded-full p-3 text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600"
                >
                  <Paperclip size={20} />
                </button>

                <input
                  type="text"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-none bg-transparent py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                />

                <button
                  type="button"
                  className="flex items-center justify-center rounded-full bg-sky-600 p-4 text-white shadow-lg shadow-sky-200 transition-all hover:bg-sky-700 active:scale-95 group-hover:scale-105"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PortalLayout>
  );
};

export default StudentMessages;
