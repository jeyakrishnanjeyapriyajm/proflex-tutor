import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Edit3,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import {
  createAdminCurriculumModule,
  deleteAdminCurriculumModule,
  getAdminCurriculumModules,
  toggleAdminCurriculumModuleStatus,
  updateAdminCurriculumModule,
} from "../../services/adminService";
import Loading from "../common/Loading";

const emptyForm = {
  title: "",
  description: "",
  orderNo: 1,
  level: "Beginner",
  estimatedTime: "30 minutes",
};

const AdminCurriculum = () => {
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchModules = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getAdminCurriculumModules();
      setModules(data.modules || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAdminCurriculumModule(editingId, form);
        setMessage("Module updated successfully");
      } else {
        await createAdminCurriculumModule(form);
        setMessage("Module created successfully");
      }

      resetForm();
      fetchModules();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save module");
    }
  };

  const handleEdit = (module) => {
    setEditingId(module._id);

    setForm({
      title: module.title || module.name || "",
      description: module.description || "",
      orderNo: module.orderNo || 1,
      level: module.level || "Beginner",
      estimatedTime: module.estimatedTime || "30 minutes",
    });
  };

  const handleToggle = async (moduleId) => {
    try {
      await toggleAdminCurriculumModuleStatus(moduleId);
      setMessage("Module status updated");
      fetchModules();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (moduleId) => {
    try {
      await deleteAdminCurriculumModule(moduleId);
      setMessage("Module disabled successfully");
      fetchModules();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete module");
    }
  };

  if (loading) {
    return <Loading text="Loading curriculum modules..." />;
  }

  return (
    <div>
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Curriculum Management
          </h2>

          <p className="mt-2 text-base font-medium text-slate-500">
            Manage C programming modules, order, level and availability.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchModules}
          className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </header>

      {message && (
        <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm font-black text-sky-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm xl:col-span-4">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Plus size={24} />
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                {editingId ? "Edit Module" : "Add Module"}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                C programming curriculum
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                Module Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Loops"
                className="w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Learn for, while, do-while and nested loops."
                rows={4}
                className="w-full resize-none rounded-2xl border border-transparent bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  Order
                </label>
                <input
                  name="orderNo"
                  type="number"
                  value={form.orderNo}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                  Level
                </label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
                Estimated Time
              </label>
              <input
                name="estimatedTime"
                value={form.estimatedTime}
                onChange={handleChange}
                placeholder="30 minutes"
                className="w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-3 text-sm font-bold text-slate-900 outline-none focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
              />
            </div>

            <div className="flex gap-3 pt-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 font-black text-slate-500 transition-all hover:bg-slate-200"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="flex-[2] rounded-2xl bg-sky-600 py-3 font-black text-white shadow-lg shadow-sky-100 transition-all hover:bg-sky-700"
              >
                {editingId ? "Update Module" : "Create Module"}
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm xl:col-span-8">
          <div className="border-b border-slate-50 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <BookOpen size={24} />
              </div>

              <div>
                <h3 className="font-black text-slate-900">
                  C Programming Modules
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {modules.length} modules found
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {modules.map((module) => (
              <div
                key={module._id}
                className="flex flex-col gap-5 p-6 transition-all hover:bg-slate-50/60 lg:flex-row lg:items-center lg:justify-between lg:p-8"
              >
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                    {module.orderNo || 1}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {module.title || module.name}
                    </h3>

                    <p className="mt-1 max-w-xl text-sm font-medium text-slate-500">
                      {module.description || "No description added."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-600">
                        {module.level || "Beginner"}
                      </span>

                      <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {module.estimatedTime || "30 minutes"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          module.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {module.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(module)}
                    className="rounded-xl p-3 text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600"
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(module._id)}
                    className="rounded-xl p-3 text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
                    title="Toggle status"
                  >
                    <CheckCircle2 size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(module._id)}
                    className="rounded-xl p-3 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                    title="Disable"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {modules.length === 0 && (
              <div className="p-12 text-center">
                <h3 className="text-xl font-black text-slate-900">
                  No modules found
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Create your first C programming module from the form.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCurriculum;
