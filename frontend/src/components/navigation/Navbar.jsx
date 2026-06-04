import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { getDashboardPath } from "../../utils/redirectByRole";
import Button from "../common/Button";
import Badge from "../common/Badge";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">LearnSphere</h1>
            <p className="text-xs font-medium text-slate-500">Role Based LMS</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink to={getDashboardPath(user)} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Badge
                variant={
                  user?.role === "admin"
                    ? "red"
                    : user?.roleStatus === "pending"
                      ? "orange"
                      : "green"
                }
              >
                {user?.roleStatus === "pending"
                  ? "Pending Approval"
                  : user?.role}
              </Badge>

              <Button variant="light" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="light">Login</Button>
              </Link>

              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2 md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            {isAuthenticated && (
              <Link to={getDashboardPath(user)} onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="light" className="w-full">
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
