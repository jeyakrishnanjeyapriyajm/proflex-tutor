const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Initial Assessment",
      desc: "Students complete a diagnostic assessment to map their current C programming knowledge.",
    },
    {
      step: "02",
      title: "Adaptive Pathing",
      desc: "The system generates a personalized learning path based on the student’s weaknesses.",
    },
    {
      step: "03",
      title: "Active Coding",
      desc: "Students solve problems while receiving real-time feedback and guided support.",
    },
    {
      step: "04",
      title: "Mastery Verification",
      desc: "Students complete mastery tasks to unlock new concepts and progress levels.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            How ProgFlex Works
          </h2>

          <p className="mx-auto max-w-2xl text-slate-600">
            A data-driven approach to mastering programming concepts through
            AI-powered adaptive learning.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-1/2 z-0 hidden h-0.5 -translate-y-1/2 bg-slate-100 md:block" />

          {steps.map((item, index) => (
            <div key={index} className="relative z-10 bg-white p-6 text-center">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 font-bold text-white shadow-lg shadow-sky-200">
                {item.step}
              </div>

              <h3 className="mb-3 font-bold text-slate-900">{item.title}</h3>

              <p className="text-sm leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
