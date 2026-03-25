"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./Button";

interface FloatingNavProps {
  peraLogo: string;
  tennisLogo: string;
}

export function FloatingNav({ peraLogo, tennisLogo }: FloatingNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-3" : "py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          animate={{
            boxShadow: isScrolled
              ? "0 20px 50px rgba(0, 0, 0, 0.1)"
              : "0 10px 30px rgba(0, 0, 0, 0.05)",
          }}
          className={`bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-white/20 px-8 py-4 transition-all duration-300 ${isScrolled ? "shadow-2xl" : ""
            }`}
        >
          <div className="flex items-center justify-between gap-8">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  src={peraLogo}
                  alt="University Logo"
                  className="w-12 h-12 rounded-full shadow-lg"
                />
                <motion.img
                  whileHover={{ scale: 1.1, rotate: -360 }}
                  transition={{ duration: 0.6 }}
                  src={tennisLogo}
                  alt="Tennis Logo"
                  className="w-12 h-12 rounded-full shadow-lg"
                />
              </div>
              <div className="hidden lg:block border-l-2 border-border pl-4">
                <h1 className="font-bold text-lg text-primary">
                  PERA SLAM
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">2026</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink href="#rules" onClick={() => scrollToSection("rules")}>
                Rules & Payment
              </NavLink>
              <NavLink href="#registration-form" onClick={() => scrollToSection("registration-form")}>
                Register
              </NavLink>
              <NavLink href="#schedule" onClick={() => scrollToSection("schedule")}>
                Schedule
              </NavLink>
              <NavLink href="#contact" onClick={() => scrollToSection("contact")}>
                Contact
              </NavLink>
            </div>

            {/* CTA Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => scrollToSection("registration-form")}
              className="hidden sm:block"
            >
              Register Now
            </Button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`w-6 h-0.5 bg-foreground transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-2" : "mb-1.5"}`}></div>
              <div className={`w-6 h-0.5 bg-foreground transition-all ${isMobileMenuOpen ? "opacity-0 mb-1.5" : "mb-1.5"}`}></div>
              <div className={`w-6 h-0.5 bg-foreground transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
            </button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden flex flex-col gap-2 pt-4 mt-4 border-t border-border/50"
              >
                <NavLink href="#rules" onClick={() => scrollToSection("rules")}>Rules</NavLink>
                <NavLink href="#registration-form" onClick={() => scrollToSection("registration-form")}>Register</NavLink>
                <NavLink href="#schedule" onClick={() => scrollToSection("schedule")}>Schedule</NavLink>
                <NavLink href="#contact" onClick={() => scrollToSection("contact")}>Contact</NavLink>
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  onClick={() => scrollToSection("registration-form")}
                >
                  Register Now
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.nav>
  );
}

function NavLink({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 rounded-full text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-200 block text-center md:inline-block cursor-pointer"
    >
      {children}
    </motion.a>
  );
}
