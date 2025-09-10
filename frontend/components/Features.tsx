"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Code2, Award, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Practice Challenges",
    description:
      "Sharpen your coding skills with real-world challenges and problems.",
    icon: <Code2 className="h-8 w-8 text-green-500" />,
  },
  {
    title: "Certify Skills",
    description:
      "Earn certificates that showcase your technical expertise to employers.",
    icon: <Award className="h-8 w-8 text-green-500" />,
  },
  {
    title: "Compete in Contests",
    description:
      "Join global competitions and test yourself against other developers.",
    icon: <Users className="h-8 w-8 text-green-500" />,
  },
  {
    title: "For Companies",
    description:
      "Hire top talent and assess skills with AI-powered tools.",
    icon: <Briefcase className="h-8 w-8 text-green-500" />,
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-green-500">CodeSprint</span>?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-gray-900 border border-gray-800 hover:border-green-500 transition">
                <CardHeader className="flex items-center space-x-4">
                  {feature.icon}
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-400 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
