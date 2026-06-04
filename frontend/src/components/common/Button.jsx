const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
}) => {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200",
    light: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-200",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
