import { messages } from "../../data/studentDashboardData";

const RecentMessages = () => {
  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-black text-slate-900">Recent Messages</h3>
        <button className="text-xs font-bold text-sky-600 hover:underline">
          Open Inbox
        </button>
      </div>

      <div className="space-y-5">
        {messages.map((msg) => (
          <div key={msg.name} className="flex cursor-pointer gap-4">
            <img
              src={msg.avatar}
              alt={msg.name}
              className="h-10 w-10 rounded-xl object-cover shadow-sm"
            />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">{msg.name}</p>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {msg.time}
                </span>
              </div>

              <p className="truncate text-xs leading-relaxed text-slate-500">
                {msg.msg}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentMessages;
