import {
  db,
  adminsTable,
  announcementsTable,
  eventsTable,
  enrollmentTable,
  galleryTable,
  faqsTable,
} from "@workspace/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existingAdmins = await db.select().from(adminsTable);
  if (existingAdmins.length === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await db.insert(adminsTable).values({
      username: "admin",
      passwordHash,
    });
    console.log("Admin created: username=admin, password=admin123");
  }

  const existingAnnouncements = await db.select().from(announcementsTable);
  if (existingAnnouncements.length === 0) {
    await db.insert(announcementsTable).values([
      {
        title: "NCC Annual Training Camp 2026",
        content:
          "The annual NCC training camp will be held from May 15-25, 2026 at the NCC Training Academy. All enrolled cadets are required to attend. The camp will include physical training, weapon handling, map reading, and leadership exercises. Report to the NCC office by May 10 for registration and kit collection.",
      },
      {
        title: "Republic Day Parade Selection Trials",
        content:
          "Selection trials for the Republic Day Parade contingent will commence from June 1, 2026. Interested cadets must submit their applications through their respective unit commanders by May 25. Only cadets with minimum B certificate and exemplary discipline record will be considered.",
      },
      {
        title: "NCC Day Celebration Notice",
        content:
          "NCC Day will be celebrated on November 22, 2026 with a grand ceremony. All units are requested to prepare cultural programs, drill displays, and community service reports. Chief Guest will be the Director General of NCC.",
      },
    ]);
    console.log("Announcements seeded");
  }

  const existingEvents = await db.select().from(eventsTable);
  if (existingEvents.length === 0) {
    await db.insert(eventsTable).values([
      {
        title: "Combined Annual Training Camp",
        description:
          "A 10-day residential training camp covering drill, weapon training, map reading, field craft, and adventure activities. Cadets will participate in inter-unit competitions and earn certificates.",
        date: new Date("2026-05-15"),
        dutyDescription:
          "All cadets must report in proper NCC uniform with prescribed kit. Senior cadets will assist in organizing activities and mentoring junior cadets.",
      },
      {
        title: "Independence Day Flag Hoisting Ceremony",
        description:
          "NCC cadets will participate in the Independence Day celebrations at the district headquarters. Guard of honour, flag hoisting ceremony, and march past will be conducted.",
        date: new Date("2026-08-15"),
        dutyDescription:
          "Cadets selected for the guard of honour must attend rehearsals from August 10. All participants must wear ceremonial dress with polished boots.",
      },
      {
        title: "Social Service and Tree Plantation Drive",
        description:
          "NCC cadets will organize a community service event including tree plantation, cleanliness drive, and awareness campaign on environmental conservation in nearby villages.",
        date: new Date("2026-06-05"),
        dutyDescription:
          "Each cadet must plant at least 5 saplings. Tools and saplings will be provided. Cadets should wear working dress and carry water bottles.",
      },
    ]);
    console.log("Events seeded");
  }

  const existingEnrollment = await db.select().from(enrollmentTable);
  if (existingEnrollment.length === 0) {
    await db.insert(enrollmentTable).values({
      dates:
        "Enrollment for NCC is open from July 1 to August 31 every academic year. Late applications may be considered subject to availability of vacancies.",
      process:
        "1. Obtain the enrollment form from the NCC office or download from the official website.\n2. Fill in all required details with supporting documents (age proof, educational certificates, medical fitness certificate).\n3. Submit the completed form to the NCC unit office.\n4. Attend the physical fitness test and interview.\n5. Selected candidates will be notified within 2 weeks.\n6. Attend the enrollment ceremony and oath-taking.",
      eligibility:
        "- Must be a bonafide student of a school/college affiliated with the NCC unit.\n- Age: 13-26 years (Junior Division: 13-17 years, Senior Division: 17-26 years).\n- Must be physically and medically fit.\n- Must have the consent of parents/guardians.\n- Must not have any criminal record.\n- Must be willing to attend all scheduled training sessions and camps.",
    });
    console.log("Enrollment seeded");
  }

  const existingGallery = await db.select().from(galleryTable);
  if (existingGallery.length === 0) {
    await db.insert(galleryTable).values([
      {
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/NCC_India_logo.png/220px-NCC_India_logo.png",
        category: "General",
        caption: "National Cadet Corps Official Emblem",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600",
        category: "Training",
        caption: "Cadets during physical training session",
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600",
        category: "Parade",
        caption: "NCC cadets during Republic Day parade rehearsal",
      },
    ]);
    console.log("Gallery seeded");
  }

  const existingFaqs = await db.select().from(faqsTable);
  if (existingFaqs.length === 0) {
    await db.insert(faqsTable).values([
      {
        question: "What is NCC?",
        answer:
          "The National Cadet Corps (NCC) is the Indian military cadet corps with its headquarters in New Delhi. It is open to school and college students on voluntary basis. NCC is the largest uniformed youth organization in the world.",
      },
      {
        question: "How can I join NCC?",
        answer:
          "You can join NCC by enrolling through your school or college that has an NCC unit. Fill the enrollment form during the enrollment period (July-August), pass the physical fitness test, and attend the selection interview.",
      },
      {
        question: "What are the NCC certificates?",
        answer:
          "NCC awards three certificates: A Certificate (after 2 years in Junior Division), B Certificate (after 2 years in Senior Division), and C Certificate (after 3 years in Senior Division). These certificates provide benefits in government job selections and university admissions.",
      },
      {
        question: "What is the NCC motto?",
        answer:
          "The motto of NCC is 'Unity and Discipline'. It was adopted on 23 December 1957 and reflects the core values that NCC aims to instill in its cadets.",
      },
      {
        question: "What are the benefits of joining NCC?",
        answer:
          "Benefits include: personality development, leadership training, adventure activities, preference in armed forces recruitment, bonus marks in some university admissions, reservation in government jobs, and participation in national events like Republic Day Parade.",
      },
      {
        question: "What activities does NCC conduct?",
        answer:
          "NCC conducts various activities including drill training, weapon training, map reading, field craft, adventure camps, trekking, mountaineering, social service, community development programs, and cultural activities.",
      },
      {
        question: "What is the age limit for joining NCC?",
        answer:
          "For Junior Division (JD/JW): 13-17 years. For Senior Division (SD/SW): 17-26 years. Junior Division is for school students, while Senior Division is for college students.",
      },
      {
        question: "How many divisions does NCC have?",
        answer:
          "NCC has three wings: Army Wing, Navy Wing, and Air Force Wing. Cadets can choose their preferred wing based on availability at their institution.",
      },
      {
        question: "When was NCC established?",
        answer:
          "The National Cadet Corps was established on 16 April 1948 under the NCC Act XXXI of 1948. It was raised on the recommendation of H.N. Kunzru Committee in 1946.",
      },
      {
        question: "What uniform does NCC wear?",
        answer:
          "NCC cadets wear khaki uniform for the Army Wing, white uniform for the Navy Wing, and light blue uniform for the Air Force Wing. The uniform includes prescribed accessories like belt, cap, and boots.",
      },
    ]);
    console.log("FAQs seeded");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
