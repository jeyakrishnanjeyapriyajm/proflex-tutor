import {
  BrainCircuit,
  MessageSquare,
  TrendingUp,
  Code2,
  BarChart3,
  Sparkles,
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: "Knowledge Tracing",
      desc: "Real-time estimation of student mastery using adaptive learning models.",
    },
    {
      icon: MessageSquare,
      title: "Intelligent Feedback",
      desc: "NLP-driven hints and debugging suggestions that guide without giving away the answer.",
    },
    {
      icon: TrendingUp,
      title: "Adaptive Learning Paths",
      desc: "Lessons and exercises unlock based on the learner’s current competency.",
    },
    {
      icon: Code2,
      title: "Integrated Workspace",
      desc: "Coding environment with side-by-side lessons and AI-powered assistance.",
    },
    {
      icon: BarChart3,
      title: "Instructor Insights",
      desc: "Analytics for lecturers to identify at-risk students and concept bottlenecks.",
    },
    {
      icon: Sparkles,
      title: "Gamified Experience",
      desc: "Earn XP, maintain streaks, and unlock achievements while learning C.",
    },
  ];

  return (
    <section id="features" className="bg-slate-50/50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Built for Modern Education
          </h2>

          <p className="mx-auto max-w-2xl text-slate-600">
            ProgFlex provides a learning experience that behaves like a personal
            tutor for programming students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon size={28} />
                </div>

                <h3 className="mb-4 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-600">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
