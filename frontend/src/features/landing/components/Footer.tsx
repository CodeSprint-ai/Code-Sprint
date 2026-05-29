import React from 'react';
import { Terminal, Github, Twitter, Linkedin, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Problem Bank", href: "/problems" },
        { label: "Coding Workspace", href: "/workspace" },
        { label: "AI Analysis", href: "/ai-analysis" },
        { label: "Learning Roadmap", href: "/roadmap" },
      ]
    },
    {
      title: "Gamification & Events",
      links: [
        { label: "Global Calendar", href: "/events" },
        { label: "Leaderboards", href: "/leaderboard" },
        { label: "Badges", href: "/badges" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#", badge: "Hiring" },
        { label: "Legal", href: "#" },
        { label: "Contact", href: "#" },
      ]
    }
  ];

  return (
    <footer className="pt-20 pb-10 relative overflow-hidden dark:bg-transparent bg-zinc-50/50">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[128px] pointer-events-none" />

        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px dark:bg-white/5 bg-zinc-200" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-tr from-brand-green to-emerald-900 p-2 rounded-lg">
                 <Terminal className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold dark:text-white text-zinc-900 code-font">
                CodeSprint<span className="text-brand-green"></span>
              </span>
            </div>
            <p className="dark:text-gray-400 text-zinc-600 mb-8 leading-relaxed text-sm max-w-xs">
              The intelligent platform for developers to learn, practice, and get hired. Built by engineers, for engineers.
            </p>
            
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                    key={i} 
                    href={social.href} 
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full dark:bg-white/5 bg-zinc-100 border dark:border-white/10 border-zinc-200 flex items-center justify-center dark:text-gray-400 text-zinc-500 transition-all duration-300 hover:scale-110 hover:border-brand-green/50 hover:text-brand-green hover:bg-brand-green/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Spacer Column */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Columns */}
          {footerLinks.map((column, idx) => (
              <motion.div variants={itemVariants} key={idx} className="col-span-1">
                  <h4 className="dark:text-white text-zinc-900 font-bold mb-6 text-base tracking-wide">{column.title}</h4>
                  <ul className="space-y-4 text-sm dark:text-gray-400 text-zinc-600">
                  {column.links.map((link, i) => (
                      <li key={i}>
                          <a href={link.href} className="hover:text-brand-green transition-colors flex items-center gap-2 group w-fit">
                              <span className="relative">
                                  {link.label}
                                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-green transition-all group-hover:w-full" />
                              </span>
                              {link.badge && (
                                  <span className="text-[10px] bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded ml-1 font-bold border border-brand-green/20">
                                      {link.badge}
                                  </span>
                              )}
                          </a>
                      </li>
                  ))}
                  </ul>
              </motion.div>
          ))}
        </motion.div>
        
        {/* Bottom Bar */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="pt-8 border-t dark:border-white/5 border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6"
        >
            <p className="dark:text-gray-500 text-zinc-500 text-sm">
                © 2026 CodeSprint Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm dark:text-gray-500 text-zinc-500 font-medium">
                <a href="#" className="dark:hover:text-white hover:text-zinc-900 transition-colors">Privacy Policy</a>
                <a href="#" className="dark:hover:text-white hover:text-zinc-900 transition-colors">Terms of Service</a>
                <a href="#" className="dark:hover:text-white hover:text-zinc-900 transition-colors">Cookie Settings</a>
            </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;