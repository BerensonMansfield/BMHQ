export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-12 pb-8">
      <h1 className="font-display text-3xl">{title}</h1>
      <p className="mt-2 text-muted">{description}</p>
    </div>
  );
}
