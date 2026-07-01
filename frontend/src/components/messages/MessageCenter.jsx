import { useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  RefreshCw,
  Search,
  Send,
  Users,
  UserRound,
} from "lucide-react";

import {
  getMessageStudents,
  getSentMessages,
  sendMessage,
} from "../../services/messageService";

const getInitials = (name = "User") => {
  return name
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MessageCenter = ({ role = "lecturer" }) => {
  const [students, setStudents] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("single");
  const [draftMessage, setDraftMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const selectedStudent = students.find(
    (student) => String(student._id) === String(selectedStudentId),
  );

  const filteredStudents = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return students;

    return students.filter((student) => {
      return (
        student.name?.toLowerCase().includes(keyword) ||
        student.email?.toLowerCase().includes(keyword)
      );
    });
  }, [students, searchTerm]);

  const getPrivateMessagesForStudent = (studentId) => {
    if (!studentId) return [];

    return sentMessages
      .filter((message) => {
        if (message.audienceType !== "single") return false;

        return message.recipients?.some(
          (recipient) =>
            String(recipient._id || recipient) === String(studentId),
        );
      })
      .flatMap((message) => {
        const mainMessage = {
          _id: message._id,
          type: "sent",
          body: message.body,
          subject: message.subject,
          createdAt: message.createdAt,
          senderName: role === "admin" ? "Admin" : "Lecturer",
        };

        const replies =
          message.replies?.map((reply, index) => ({
            _id: `${message._id}-reply-${index}`,
            type: "reply",
            body: reply.body,
            createdAt: reply.createdAt,
            senderName:
              reply.sender?.name || selectedStudent?.name || "Student",
          })) || [];

        return [mainMessage, ...replies];
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const selectedStudentMessages = useMemo(() => {
    return getPrivateMessagesForStudent(selectedStudentId);
  }, [sentMessages, selectedStudentId, selectedStudent?.name, role]);

  const getLatestPrivateMessage = (studentId) => {
    const privateMessages = sentMessages
      .filter((message) => {
        if (message.audienceType !== "single") return false;

        return message.recipients?.some(
          (recipient) =>
            String(recipient._id || recipient) === String(studentId),
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return privateMessages[0] || null;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setNotice({ type: "", text: "" });

      const [studentData, sentData] = await Promise.all([
        getMessageStudents(),
        getSentMessages(),
      ]);

      const studentList = studentData.students || [];

      setStudents(studentList);
      setSentMessages(sentData.messages || []);

      if (!selectedStudentId && studentList.length > 0) {
        setSelectedStudentId(studentList[0]._id);
      }
    } catch (error) {
      console.error("LOAD MESSAGE CENTER ERROR:", error);

      setNotice({
        type: "error",
        text: error.response?.data?.message || "Failed to load messages.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSend = async () => {
    if (!draftMessage.trim()) return;

    if (mode === "single" && !selectedStudentId) {
      setNotice({
        type: "error",
        text: "Please select a student.",
      });
      return;
    }

    try {
      setSending(true);
      setNotice({ type: "", text: "" });

      await sendMessage({
        audienceType: mode === "all" ? "all_students" : "single",
        recipientId: mode === "single" ? selectedStudentId : undefined,
        subject:
          mode === "all"
            ? "Announcement"
            : `Message to ${selectedStudent?.name || "student"}`,
        body: draftMessage.trim(),
      });

      setDraftMessage("");

      setNotice({
        type: "success",
        text:
          mode === "all"
            ? "Announcement sent to all students."
            : "Message sent successfully.",
      });

      await loadData();
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);

      setNotice({
        type: "error",
        text: error.response?.data?.message || "Failed to send message.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] min-h-[720px] overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
      <aside className="hidden w-96 shrink-0 flex-col border-r border-slate-100 bg-slate-50 md:flex">
        <div className="border-b border-slate-100 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Messages</h1>

              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                {role === "admin" ? "Admin Portal" : "Lecturer Portal"}
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="rounded-2xl bg-sky-50 p-3 text-sky-600 transition hover:bg-sky-100 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setMode("single");
                setNotice({ type: "", text: "" });
              }}
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition ${
                mode === "single"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <UserRound size={15} />
              One Student
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("all");
                setNotice({ type: "", text: "" });
              }}
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black transition ${
                mode === "all"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Users size={15} />
              All
            </button>
          </div>

          {mode === "single" && (
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search students..."
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-sky-200 focus:bg-white"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {mode === "all" && (
            <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                <Megaphone size={24} />
              </div>

              <h3 className="text-lg font-black text-sky-900">
                Broadcast Message
              </h3>

              <p className="mt-3 text-sm font-bold leading-6 text-sky-700">
                This will send one announcement to all students. It will not be
                mixed with private student chats.
              </p>

              <p className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-black text-sky-700 shadow-sm">
                Total students: {students.length}
              </p>
            </div>
          )}

          {mode === "single" && (
            <>
              {loading && students.length === 0 && (
                <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-400">
                  Loading students...
                </div>
              )}

              {!loading && filteredStudents.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-bold text-slate-400">
                  No students found.
                </div>
              )}

              <div className="space-y-1">
                {filteredStudents.map((student) => {
                  const isActive =
                    String(student._id) === String(selectedStudentId);

                  const latestMessage = getLatestPrivateMessage(student._id);

                  return (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(student._id);
                        setNotice({ type: "", text: "" });
                      }}
                      className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition ${
                        isActive
                          ? "bg-white shadow-sm ring-2 ring-sky-100"
                          : "hover:bg-white"
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sm font-black text-sky-700">
                        {getInitials(student.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-black text-slate-900">
                            {student.name}
                          </p>

                          {latestMessage?.createdAt && (
                            <span className="whitespace-nowrap text-[10px] font-black text-slate-400">
                              {formatDateTime(latestMessage.createdAt)}
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs font-semibold text-slate-400">
                          {student.email}
                        </p>

                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                          {latestMessage?.body || "No private messages yet"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-5 shadow-sm lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sm font-black text-sky-700">
              {mode === "all" ? (
                <Users size={22} />
              ) : (
                getInitials(selectedStudent?.name)
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-black text-slate-900">
                {mode === "all"
                  ? "All Students"
                  : selectedStudent?.name || "Select Student"}
              </h2>

              <p className="mt-0.5 truncate text-xs font-black uppercase tracking-widest text-slate-400">
                {mode === "all"
                  ? "Broadcast Announcement"
                  : selectedStudent?.email || "Private Chat"}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
            {mode === "all" ? "Broadcast" : "Private"}
          </span>
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

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/50 p-5 lg:p-8">
          {mode === "all" && (
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-dashed border-sky-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Megaphone size={30} />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Send announcement to all students
              </h3>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
                This broadcast will appear in student inboxes, but it will not
                be shown inside each private chat.
              </p>
            </div>
          )}

          {mode === "single" && selectedStudentMessages.length === 0 && (
            <div className="mx-auto max-w-md rounded-[2rem] border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Send size={28} />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                No private messages yet
              </h3>

              <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
                Start a separate private chat with this student.
              </p>
            </div>
          )}

          {mode === "single" &&
            selectedStudentMessages.map((item) => {
              const isMe = item.type === "sent";

              return (
                <div
                  key={item._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl p-5 text-sm font-semibold leading-7 shadow-sm md:max-w-[70%] ${
                      isMe
                        ? "rounded-tr-none bg-sky-600 text-white"
                        : "rounded-tl-none border border-slate-100 bg-white text-slate-600"
                    }`}
                  >
                    {item.subject && isMe && (
                      <p className="mb-2 text-xs font-black uppercase tracking-widest opacity-70">
                        {item.subject}
                      </p>
                    )}

                    <p className="whitespace-pre-wrap">{item.body}</p>

                    <p
                      className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                        isMe ? "text-sky-100" : "text-slate-400"
                      }`}
                    >
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="border-t border-slate-100 bg-white p-5 lg:p-6">
          <div className="flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-slate-50 p-2 shadow-inner">
            <input
              type="text"
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder={
                mode === "all"
                  ? "Type announcement for all students..."
                  : `Message ${selectedStudent?.name || "student"}...`
              }
              disabled={sending || (mode === "single" && !selectedStudentId)}
              className="flex-1 border-none bg-transparent px-4 py-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                sending ||
                !draftMessage.trim() ||
                (mode === "single" && !selectedStudentId)
              }
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
      </main>
    </div>
  );
};

export default MessageCenter;
