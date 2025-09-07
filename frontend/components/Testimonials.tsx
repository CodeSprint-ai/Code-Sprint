// components/Testimonials.tsx
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Software Engineer at TechCorp",
    text: "CodeSprint helped me practice real-world challenges and land my dream job.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Ali Raza",
    role: "Computer Science Student",
    text: "The contests and certificates boosted my confidence and skills massively.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Ahmed",
    role: "HR Manager at InnovateX",
    text: "We hired top talent through CodeSprint’s company-focused platform. A game-changer!",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Success Stories from <span className="text-green-500">Developers</span> &{" "}
          <span className="text-green-500">Companies</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900 border border-gray-800 hover:border-green-500 transition h-full flex flex-col">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Image
                src={t.img}
                alt={t.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full mb-4 border-2 border-green-500 object-cover mx-auto"
              />
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-green-500 text-sm mb-3">{t.role}</p>
                  <p className="text-gray-400 text-sm italic">“{t.text}”</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
