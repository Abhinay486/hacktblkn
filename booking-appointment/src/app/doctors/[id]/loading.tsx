export default function LoadingDoctor() {
  return (
    <main className="mx-auto max-w-4xl p-6 animate-pulse">
      <div className="h-10 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded mb-6" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-40 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-40 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </main>
  );
}
