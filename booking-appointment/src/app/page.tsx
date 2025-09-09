import prisma from "../../lib/prisma";
import Link from "next/link";

export default async function Home() {
  const doctors = await prisma.doctor.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {doctors.length > 0
            ? `Showing ${doctors.length} doctor${doctors.length === 1 ? "" : "s"}.`
            : "No doctors found."}
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => {
          const initials = d.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("");
          return (
            <Link
              key={d.id}
              href={`/doctors/${d.id}`}
              className="group relative flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 p-5 hover:border-indigo-400/70 hover:shadow-sm transition"
            >
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-semibold flex items-center justify-center overflow-hidden text-lg shrink-0">
                  {d.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold leading-tight group-hover:text-indigo-600 line-clamp-1">
                    {d.name}
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {d.speciality}
                    {d.degree ? ` • ${d.degree}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium">
                {typeof d.experience === "number" && (
                  <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-400/30">
                    {d.experience} yrs
                  </span>
                )}
                {typeof d.fees === "number" && (
                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                    ${d.fees}
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded border text-emerald-600 dark:text-emerald-400 border-emerald-400/30 bg-emerald-500/10 ${
                    d.available ? "" : "!text-rose-600 dark:!text-rose-400 border-rose-400/30 bg-rose-500/10"
                  }`}
                >
                  {d.available ? "Available" : "Unavailable"}
                </span>
              </div>
              {d.about && (
                <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3">
                  {d.about}
                </p>
              )}
              <span className="absolute inset-0 rounded-xl ring-0 ring-indigo-500/0 group-hover:ring-2 group-hover:ring-indigo-500/40 pointer-events-none transition" />
            </Link>
          );
        })}
      </section>
    </main>
  );
}
