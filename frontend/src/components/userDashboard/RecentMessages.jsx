import { useNavigate } from "react-router-dom";

const RecentMessages = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 text-left shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Recent Messages</h3>

        <button
          onClick={() => navigate("/student/messages")}
          className="text-xs font-bold text-sky-600 hover:underline"
        >
          Open Inbox
        </button>
      </div>

      <div className="space-y-5">
        {items.map((msg, index) => (
          <div
            key={msg.name || index}
            className="group flex cursor-pointer gap-4 text-left"
          >
            <img
              src={msg.avatar || "https://picsum.photos/seed/message/100/100"}
              alt={msg.name || "User"}
              className="h-10 w-10 rounded-xl object-cover shadow-sm"
            />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-bold text-slate-900">
                  {msg.name}
                </p>

                <span className="shrink-0 text-[10px] font-bold uppercase text-slate-400">
                  {msg.time}
                </span>
              </div>

              <p className="truncate text-xs leading-relaxed text-slate-500">
                {msg.message || msg.msg}
              </p>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
            <p className="text-xs font-medium text-slate-400">
              No recent messages yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentMessages;
