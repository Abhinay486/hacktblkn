// Prisma seed script
// Run with: npx prisma db seed  (after setting DATABASE_URL)
// or directly: npx tsx prisma/seed.ts

import { PrismaClient, AppointmentStatus, Gender } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Wipe existing (simple dev reset; DON'T use in production seeds)
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  // Doctors
  const doctorsData = [
    {
      name: 'Dr. Alice Heart',
      email: 'alice.heart@example.com',
      password: 'hashed-password-1', // TODO: replace with real hash (e.g., bcrypt)
      image: null,
      speciality: 'Cardiology',
      degree: 'MD',
      experience: 12,
      about: 'Cardiologist focused on preventative care.',
      available: true,
      fees: 150,
      address: '123 Health St, Wellness City',
      slotsBooked: [2, 5]
    },
    {
      name: 'Dr. Ben Neuro',
      email: 'ben.neuro@example.com',
      password: 'hashed-password-2',
      image: null,
      speciality: 'Neurology',
      degree: 'DM (Neuro)',
      experience: 9,
      about: 'Neurologist specializing in migraine management.',
      available: true,
      fees: 180,
      address: '45 Brain Ave, Neuro Town',
      slotsBooked: [1]
    },
    {
      name: 'Dr. Cara Derm',
      email: 'cara.derm@example.com',
      password: 'hashed-password-3',
      image: null,
      speciality: 'Dermatology',
      degree: 'MD',
      experience: 5,
      about: 'Dermatologist with interest in pediatric skin disorders.',
      available: false,
      fees: 120,
      address: '9 Skin Blvd, Care City',
      slotsBooked: []
    }
  ];

  const doctors = await Promise.all(
    doctorsData.map(d => prisma.doctor.create({ data: d }))
  );

  // Users
  const usersData = [
    {
      name: 'John Patient',
      email: 'john.patient@example.com',
      password: 'hashed-user-pass-1',
      image: '',
      gender: Gender.MALE,
      phone: '+10000000001',
      address: '201 Recovery Rd'
    },
    {
      name: 'Sara Wellness',
      email: 'sara.wellness@example.com',
      password: 'hashed-user-pass-2',
      image: '',
      gender: Gender.FEMALE,
      phone: '+10000000002',
      address: '55 Healthy Lane'
    }
  ];

  const users = await Promise.all(
    usersData.map(u => prisma.user.create({ data: u }))
  );

  // Appointments (today & tomorrow for demonstration)
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
  const tomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const appointmentsData = [
    {
      date: startOfToday,
      slot: 2,
      status: AppointmentStatus.CONFIRMED,
      notes: 'Follow-up on blood pressure.',
      userId: users[0].id,
      doctorId: doctors[0].id
    },
    {
      date: startOfToday,
      slot: 5,
      status: AppointmentStatus.PENDING,
      notes: 'Discuss migraine triggers.',
      userId: users[1].id,
      doctorId: doctors[1].id
    },
    {
      date: tomorrow,
      slot: 1,
      status: AppointmentStatus.PENDING,
      notes: 'Skin rash consultation.',
      userId: users[0].id,
      doctorId: doctors[2].id
    }
  ];

  await prisma.appointment.createMany({ data: appointmentsData });

  console.log(`Seed complete: ${doctors.length} doctors, ${users.length} users, ${appointmentsData.length} appointments.`);
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
