import { useEffect, useState } from "react";
import {
  Mail,
  RefreshCw,
  Reply,
  Send,
  Inbox,
  CheckCircle2,
  Clock,
} from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";
import {
  getMyMessages,
  markMessageAsRead,
  replyMessage,
} from "../services/messageService";

const formatDateTime = (dateValue) => {
  if (!dateValue) return "Not available";

  return new Date(dateValue).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSenderName = (message) => {
  return message?.sender?.name || "ProgFlex Staff";
};

const getSenderRole = (message) => {
  const role = message?.sender?.role || message?.sentByRole || "staff";

  if (role === "admin") return "Admin";
  if (role === "instructor") return "Lecturer";
  if (role === "user") return "Student";

  return "Staff";
};

const getInitials = (name = "User") => {
  return name
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const StudentMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const selectedMessage =
    messages.find((message) => message._id === selectedMessageId) ||
    messages[0] ||
    null;

  const loadMessages = async () => {
    try {
      setLoading(true);
      setNotice({ type: "", text: "" });

      const data = await getMyMessages();
      const loadedMessages = data.messages || [];

      setMessages(loadedMessages);

      if (loadedMessages.length > 0) {
        setSelectedMessageId((prev) => prev || loadedMessages[0]._id);
      } else {
        setSelectedMessageId("");
      }
    } catch (error) {
      console.error("LOAD STUDENT MESSAGES ERROR:", error);

      setNotice({
        type: "error",
        text: error.response?.data?.message || "Failed to load messages.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (!selectedMessage?._id || selectedMessage?.isRead) return;

    markMessageAsRead(selectedMessage._id)
      .then(() => {
        setMessages((prev) =>
          prev.map((message) =>
            message._id === selectedMessage._id
              ? {
                  ...message,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : message,
          ),
        );
      })
      .catch((error) => {
        console.error("MARK MESSAGE READ ERROR:", error);
      });
  }, [selectedMessage?._id]);

  const handleSelectMessage = (messageId) => {
    setSelectedMessageId(messageId);
    setDraftMessage("");
    setNotice({ type: "", text: "" });
  };

  const handleReply = async () => {
    if (!selectedMessage?._id || !draftMessage.trim()) return;

    try {
      setSending(true);
      setNotice({ type: "", text: "" });

      await replyMessage(selectedMessage._id, draftMessage.trim());

      setDraftMessage("");

      setNotice({
        type: "success",
        text: "Reply sent successfully.",
      });

      await loadMessages();
    } catch (error) {
      console.error("SEND REPLY ERROR:", error);

      setNotice({
        type: "error",
        text: error.response?.data?.message || "Failed to send reply.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="Messages and announcements"
    >
      <div className="flex h-[calc(100vh-120px)] min-h-[720px] flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 lg:px-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-sky-600">
              <Mail size={15} />
              Message Center
            </div>

            <h1 className="text-2xl font-black text-slate-900">
              Messages & Announcements
            </h1>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              View messages from admin and lecturers. Reply when needed.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMessages}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {notice.text && (
          <div
            className={`mx-5 mt-5 rounded-2xl px-5 py-4 text-sm font-bold lg:mx-8 ${
              notice.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="hidden w-96 shrink-0 flex-col border-r border-slate-100 bg-slate-50/60 md:flex">
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Inbox</h2>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  {messages.length} message{messages.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                <Inbox size={20} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {loading && messages.length === 0 && (
                <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-400">
                  Loading messages...
                </div>
              )}

              {!loading && messages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-bold text-slate-400">
                  No messages yet.
                </div>
              )}

              <div className="space-y-3">
                {messages.map((message) => {
                  const isActive = selectedMessage?._id === message._id;
                  const senderName = getSenderName(message);

                  return (
                    <button
                      key={message._id}
                      type="button"
                      onClick={() => handleSelectMessage(message._id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? "border-sky-200 bg-white shadow-sm"
                          : "border-transparent bg-white/70 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xs font-black text-sky-700">
                          {getInitials(senderName)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <p
                              className={`truncate text-sm font-black ${
                                isActive ? "text-sky-600" : "text-slate-900"
                              }`}
                            >
                              {senderName}
                            </p>

                            {!message.isRead && (
                              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-sky-600" />
                            )}
                          </div>

                          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {getSenderRole(message)}
                          </p>

                          <p className="line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                            {message.body || ""}
                          </p>

                          <p className="mt-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <Clock size={12} />
                            {formatDateTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col bg-white">
            {!selectedMessage && (
              <div className="flex flex-1 items-center justify-center p-8">
                <div className="max-w-md rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <Mail size={26} />
                  </div>

                  <h2 className="text-xl font-black text-slate-900">
                    No message selected
                  </h2>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    Messages from admins and lecturers will appear here.
                  </p>
                </div>
              </div>
            )}

            {selectedMessage && (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 shadow-sm lg:px-8">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sm font-black text-sky-700">
                      {getInitials(getSenderName(selectedMessage))}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black text-slate-900">
                        {getSenderName(selectedMessage)}
                      </h2>

                      <p className="mt-0.5 text-xs font-black uppercase tracking-widest text-slate-400">
                        {getSenderRole(selectedMessage)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
                      selectedMessage.isRead
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-sky-50 text-sky-700"
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    {selectedMessage.isRead ? "Read" : "New"}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50/40 p-5 lg:p-8">
                  <div className="mx-auto max-w-4xl space-y-6">
                    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                            Message
                          </p>

                          <h3 className="mt-1 text-xl font-black text-slate-900">
                            {selectedMessage.subject || "No subject"}
                          </h3>
                        </div>

                        <p className="text-right text-xs font-bold text-slate-400">
                          {formatDateTime(selectedMessage.createdAt)}
                        </p>
                      </div>

                      <p className="whitespace-pre-wrap text-sm font-semibold leading-7 text-slate-600">
                        {selectedMessage.body || ""}
                      </p>
                    </div>

                    {selectedMessage.replies?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-black text-slate-700">
                          <Reply size={16} />
                          Replies
                        </h4>

                        {selectedMessage.replies.map((reply, index) => (
                          <div
                            key={reply._id || index}
                            className="rounded-2xl bg-sky-600 p-5 text-sm font-semibold leading-7 text-white shadow-sm"
                          >
                            <p>{reply.body}</p>

                            <p className="mt-3 text-xs font-bold text-sky-100">
                              {formatDateTime(reply.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-white p-5 lg:p-8">
                  <div className="mx-auto flex max-w-4xl items-center gap-4 rounded-[2rem] border border-slate-100 bg-slate-50 p-2 shadow-inner">
                    <input
                      type="text"
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleReply();
                        }
                      }}
                      placeholder="Type your reply..."
                      className="flex-1 border-none bg-transparent px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={handleReply}
                      disabled={!draftMessage.trim() || sending}
                      className="flex items-center justify-center rounded-full bg-sky-600 p-4 text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? (
                        <RefreshCw size={20} className="animate-spin" />
                      ) : (
                        <Send size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </PortalLayout>
  );
};

export default StudentMessages;
