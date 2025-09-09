import prisma from "../../../../lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface DoctorPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata(
  props: DoctorPageProps
): Promise<Metadata> {
  const params = await props.params;
  const doctor = await prisma.doctor.findUnique({
    where: { id: params.id },
    select: { name: true, speciality: true },
  });
  if (!doctor) return { title: "Doctor Not Found" };
  return {
    title: `${doctor.name} | ${doctor.speciality}`,
    description: `Profile page for ${doctor.name}, ${doctor.speciality}`,
  };
}

export default async function DoctorDetailPage(props: DoctorPageProps) {
  const params = await props.params;
  const doctor = await prisma.doctor.findUnique({ where: { id: params.id } });
  if (!doctor) notFound();

  const {
    name,
    email,
    speciality,
    degree,
    experience,
    about,
    available,
    fees,
    address,
    slotsBooked,
    createdAt,
    updatedAt,
    image,
  } = doctor;

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-8">
      <header className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-semibold overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-1">
            {speciality}
            {degree ? ` • ${degree}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span
              className={`px-3 py-1 rounded-full font-medium border ${available ? "bg-emerald-500/10 text-emerald-600 border-emerald-400/40" : "bg-rose-500/10 text-rose-600 border-rose-400/40"}`}
            >
              {available ? "Available" : "Unavailable"}
            </span>
            {experience != null && (
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-400/40 font-medium">
                {experience} yrs experience
              </span>
            )}
            {fees != null && (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-400/40 font-medium">
                Fee: ${fees}
              </span>
            )}
          </div>
        </div>
      </header>

      {about && (
        <section>
          <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="leading-relaxed text-neutral-700 dark:text-neutral-200 whitespace-pre-line">
            {about}
          </p>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50/40 dark:bg-neutral-900/40 backdrop-blur-sm">
          <h3 className="font-semibold mb-3 text-neutral-800 dark:text-neutral-100">
            Contact & Location
          </h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium text-neutral-600 dark:text-neutral-400">
                Email
              </dt>
              <dd>{email}</dd>
            </div>
            {address && (
              <div>
                <dt className="font-medium text-neutral-600 dark:text-neutral-400">
                  Address
                </dt>
                <dd className="whitespace-pre-line">{address}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50/40 dark:bg-neutral-900/40 backdrop-blur-sm">
          <h3 className="font-semibold mb-3 text-neutral-800 dark:text-neutral-100">
            Booking Status
          </h3>
          <p className="text-sm mb-2 text-neutral-600 dark:text-neutral-400">
            Slots booked today / upcoming:
          </p>
          <div className="flex flex-wrap gap-2">
            {slotsBooked.length === 0 && (
              <span className="text-xs text-neutral-500 italic">No slots booked</span>
            )}
            {slotsBooked.map((s) => (
              <span
                key={s}
                className="px-2 py-1 text-xs rounded-md bg-emerald-500/15 text-emerald-600 border border-emerald-400/30"
              >
                Slot {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-neutral-50/40 dark:bg-neutral-900/40 backdrop-blur-sm text-xs text-neutral-500 dark:text-neutral-400">
        <p>Created: {formatDate(createdAt)}</p>
        <p>Updated: {formatDate(updatedAt)}</p>
        <p>ID: {doctor.id}</p>
      </section>

      <div className="pt-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
