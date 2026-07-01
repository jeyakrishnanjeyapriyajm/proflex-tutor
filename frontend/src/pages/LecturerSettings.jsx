import PortalLayout from "../layouts/PortalLayout";
import { lecturerTabs } from "../data/portalTabs";

const LecturerSettings = () => {
  return (
    <PortalLayout
      tabs={lecturerTabs}
      title="Lecturer Portal"
      subtitle="Account settings"
    >
      <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">
          Lecturer Settings
        </h1>

        <p className="mt-2 text-sm font-semibold text-slate-500">
          Lecturer settings section can be extended with profile, password, and
          notification preferences.
        </p>
      </div>
    </PortalLayout>
  );
};

export default LecturerSettings;
