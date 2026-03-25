"use client";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Trophy, Award, Star } from "lucide-react";
import { Button } from "./Button";

export function WowFooter() {
  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
  ];

  const stats = [
    { number: "100+", label: "Participants", icon: Trophy },
    { number: "6", label: "Categories", icon: Award },
    { number: "20+", label: "Prizes", icon: Star },
  ];

  return (
    <footer id="contact" className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-1/2 -left-1/4 w-[700px] h-[700px] bg-accent rounded-full blur-3xl"
        />
      </div>

      {/* Stats Banner */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 bg-gradient-to-br from-primary to-accent rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <stat.icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1 md:mb-2">
                  {stat.number}
                </h3>
                <p className="text-xs md:text-base text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              PERA SLAM 2026
            </h3>
            <p className="text-white/70 mb-6 max-w-md leading-relaxed">
              The premier tennis championship in Kandy, Sri Lanka. Join us for 3 days of
              classy tennis, fierce competition, and unforgettable moments at the heart of Kandy.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 border border-white/10 hover:border-primary/30 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Tournament Info", "Match Schedule", "Register Now", "Rules & Regulations", "Prize Distribution"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-accent transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/70 group hover:text-white transition-colors">
                <Mail className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <a href="mailto:peraslamuop@gmail.com" className="hover:text-accent transition-colors">
                    peraslamuop@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-white/70 group hover:text-white transition-colors">
                <Phone className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm text-white/50">Phone</p>
                  <a href="tel:+94812388001" className="hover:text-accent transition-colors">
                    +94 77 00 715 66
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-white/70 group hover:text-white transition-colors">
                <MapPin className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm text-white/50">Location</p>
                  <p>University of Peradeniya<br />Peradeniya, Sri Lanka</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-white/10"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
            <p className="text-white/60 mb-6">Get the latest tournament updates, match results, and exclusive news.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button variant="primary" className="rounded-full whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>&copy; 2026 University of Peradeniya. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Tennis Ball */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 right-8 w-16 h-16 bg-accent rounded-full opacity-10 blur-sm"
      />
    </footer>
  );
}
