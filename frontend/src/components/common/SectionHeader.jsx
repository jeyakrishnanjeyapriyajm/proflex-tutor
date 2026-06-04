const SectionHeader = ({ eyebrow, title, description }) => {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
