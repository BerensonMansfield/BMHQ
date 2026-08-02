export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-8 pt-10 pb-6">
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>
    </div>
  );
}
