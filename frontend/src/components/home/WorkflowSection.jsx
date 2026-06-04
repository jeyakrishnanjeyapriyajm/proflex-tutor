import SectionHeader from "../common/SectionHeader";

const WorkflowSection = () => {
  const steps = [
    "User selects Instructor during registration",
    "Backend saves instructor as pending",
    "Admin views pending instructor requests",
    "Admin approves or rejects the instructor",
    "Approved instructor can access dashboard",
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Workflow"
          title="How instructor approval works"
          description="This flow matches your backend approval system."
        />

        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">
                {index + 1}
              </div>

              <p className="text-sm font-semibold leading-6 text-slate-700">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
