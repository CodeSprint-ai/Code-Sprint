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
        { label: "Assessments", href: "#" },
        { label: "Live Interview", href: "#" },
        { label: "Learning Paths", href: "#" },
        { label: "IDE Features", href: "#" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Community Hub", href: "#" },
        { label: "Blog", href: "#" },
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
    <footer className="pt-20 pb-10 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[128px] pointer-events-none" />

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
              <span className="text-2xl font-bold text-white code-font">
                CodeSprint<span className="text-brand-green">AI</span>
              </span>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm max-w-xs">
              The intelligent platform for developers to learn, practice, and get hired. Built by engineers, for engineers.
            </p>
            
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                    key={i} 
                    href={social.href} 
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 hover:border-brand-green/50 hover:text-brand-green hover:bg-brand-green/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
          
          {/* Spacer Column (Optional, or just let grid handle it) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Columns */}
          {footerLinks.map((column, idx) => (
              <motion.div variants={itemVariants} key={idx} className="col-span-1">
                  <h4 className="text-white font-bold mb-6 text-base tracking-wide">{column.title}</h4>
                  <ul className="space-y-4 text-sm text-gray-400">
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
            className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
            <p className="text-gray-500 text-sm">
                © 2024 CodeSprintAI Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-gray-500 font-medium">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;