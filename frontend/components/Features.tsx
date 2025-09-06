import { motion } from "framer-motion";
import { Code, Trophy, Users, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Code className="w-8 h-8 text-indigo-500" />,
    title: "Coding Challenges",
    desc: "Sharpen your skills with real-world coding problems across multiple domains.",
  },
  {
    icon: <Trophy className="w-8 h-8 text-indigo-500" />,
    title: "Rank & Rewards",
    desc: "Compete globally, earn ranks, and showcase your achievements to recruiters.",
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-500" />,
    title: "Community",
    desc: "Learn, share, and grow together with a vibrant developer community.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-indigo-500" />,
    title: "Career Growth",
    desc: "Boost your profile with hands-on projects and tailored coding practice.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose <span className="text-indigo-600">CodeSprint?</span>
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Practice, compete, and grow as a developer with our platform.
        </motion.p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="rounded-2xl shadow-md hover:shadow-xl transition bg-white">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
