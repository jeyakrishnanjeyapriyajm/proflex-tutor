import {
  GraduationCap,
  Twitter,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-3xl font-bold">
              Start your learning journey today
            </h2>
            <p className="mt-3 text-blue-100 max-w-xl">
              Explore courses, improve your skills, and connect with a global
              learning community.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-slate-100 transition">
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <GraduationCap className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-2xl font-black">LearnSphere</h3>
                <p className="text-sm text-slate-400">Learn. Grow. Achieve.</p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-md">
              A modern learning platform designed to help students discover
              knowledge, build skills, and achieve their goals through quality
              education.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-8">
              {[Twitter, Linkedin, Github, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="h-11 w-11 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <h4 className="font-semibold text-lg mb-5">Platform</h4>

              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <a className="hover:text-white transition">Courses</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Learning Paths</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Certifications</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Community</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-5">Company</h4>

              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <a className="hover:text-white transition">About Us</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Careers</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Partners</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Contact</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-5">Support</h4>

              <ul className="space-y-3 text-slate-400 text-sm">
                <li>
                  <a className="hover:text-white transition">Help Center</a>
                </li>

                <li>
                  <a className="hover:text-white transition">FAQs</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Feedback</a>
                </li>

                <li>
                  <a className="hover:text-white transition">Documentation</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 LearnSphere. All rights reserved.</p>

          <div className="flex gap-6">
            <a className="hover:text-white transition">Privacy Policy</a>

            <a className="hover:text-white transition">Terms</a>

            <a className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
