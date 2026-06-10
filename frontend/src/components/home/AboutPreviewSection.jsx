const AboutPreviewSection = () => {
  return (
    <section id="about-us" className="overflow-hidden bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-[3rem] shadow-2xl">
              <img
                src="https://picsum.photos/seed/team/800/800"
                alt="ProgFlex Team"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="absolute -bottom-8 -right-8 hidden max-w-xs rounded-3xl bg-sky-600 p-8 text-white shadow-xl md:block">
              <p className="mb-2 text-lg font-bold">Our Mission</p>

              <p className="text-sm leading-relaxed text-sky-100">
                To democratize high-quality technical education through adaptive
                AI technology.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-sky-600">
              Our Team
            </h2>

            <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">
              About ProgFlex Tutor
            </h2>

            <div className="space-y-6 text-lg leading-relaxed text-slate-600">
              <p>
                ProgFlex was born out of a research project at the University of
                Colombo, Faculty of Technology. The platform focuses on solving
                a major issue in programming education: one-size-fits-all
                teaching.
              </p>

              <p>
                The system uses adaptive learning ideas to understand each
                student’s competency and provide personalized support during C
                programming practice.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <p className="mb-1 text-2xl font-bold text-slate-900">2026</p>

                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Research Project
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-2xl font-bold text-slate-900">
                    Colombo
                  </p>

                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Faculty of Technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;
