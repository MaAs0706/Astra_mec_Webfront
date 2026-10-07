import type { AstraEvent } from "@/types/Event";

/**
 * Placeholder event data. Replace with a real API response shaped as
 * AstraEvent[] once the backend exists — see services/eventService.ts.
 */
export const events: AstraEvent[] = [
  {
    id: "ethereal-2025",
    title: "Ethereal",
    category: "hackathon",
    date: "2025-10-31",
    time: "18:00",
    venue: "MEC Campus",
    summary: "A Halloween × Cyberpunk overnight bot-building buildathon created exclusively for freshers.",
    description: "The flagship event of Astra MEC 2025, Ethereal was an immersive Halloween × Cyberpunk buildathon created exclusively for the freshers. Hosted as an overnight bot-building workshop, the event led teams step-by-step through designing, assembling, and programming their own machines before sending them into a fiery RoboWar arena at the end. Driven by neon lights, high-octane engineering, and dark futuristic aesthetics, Ethereal roared through the walls of MEC as the ultimate Halloween party the campus had ever seen.",
  },
  {
    id: "orbital-build-hackathon",
    title: "Orbital Build Hackathon",
    category: "hackathon",
    date: "2026-08-02",
    time: "09:00",
    venue: "Robotics Lab, MEC",
    summary:
      "24-hour build sprint: teams design and fly a small satellite subsystem on a simulated orbit, judged on telemetry accuracy and power budget.",
  },
  {
    id: "perseid-observation-night",
    title: "Perseid Observation Night",
    category: "observation",
    date: "2026-07-18",
    time: "20:30",
    venue: "MEC Rooftop Observatory",
    summary:
      "Club telescopes out for the Perseid meteor shower peak, with guided constellation spotting for first-time observers.",
  },
  {
    id: "intro-to-flight-software",
    title: "Intro to Flight Software",
    category: "workshop",
    date: "2026-07-05",
    time: "16:00",
    venue: "CS Seminar Hall",
    summary:
      "Hands-on workshop building a basic attitude-control loop on a microcontroller, from sensor read to actuator response.",
  },
  {
    id: "life-beyond-earth-talk",
    title: "Life Beyond Earth",
    category: "talk",
    date: "2026-06-20",
    time: "17:30",
    venue: "Main Auditorium",
    summary:
      "Guest talk on current astrobiology research and what upcoming missions are searching for on Europa and Enceladus.",
  },
];
