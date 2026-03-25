"use client";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Users, Info, Trophy, Clock, CheckCircle2, Download, ShieldAlert, CreditCard, PhoneCall, ScrollText } from "lucide-react";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Select } from "./components/Select";
import { FileUpload } from "./components/FileUpload";
import { Preloader } from "./components/Preloader";
import { FloatingNav } from "./components/FloatingNav";
import { WowFooter } from "./components/WowFooter";
import peraLogoImg from "@/assets/peraLogo.png";
import tennisLogoImg from "@/assets/tennisLogo.png";

const peraLogo = peraLogoImg.src; // Placeholder for university logo
const tennisLogo = tennisLogoImg.src;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  ageCategory: string;
  paymentReceipt: File | null;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  ageCategory?: string;
  paymentReceipt?: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    ageCategory: "",
    paymentReceipt: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.ageCategory) {
      newErrors.ageCategory = "Please select an age category";
    }

    if (!formData.paymentReceipt) {
      newErrors.paymentReceipt = "Payment receipt is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitted(true);
      console.log("Form submitted:", formData);
    }
  };

  const ageCategories = [
    { value: "", label: "Select Age Category" },
    { value: "under-18", label: "Under 18" },
    { value: "18-25", label: "18-25 Years" },
    { value: "26-35", label: "26-35 Years" },
    { value: "36-45", label: "36-45 Years" },
    { value: "above-45", label: "Above 45" },
  ];

  const features = [
    {
      icon: Trophy,
      title: "Championship Trophy",
      description: "Compete for the prestigious Pera Slam Championship trophy and eternal glory",
      gradient: "from-primary to-accent",
    },
    {
      icon: Users,
      title: "Make Connections",
      description: "Get tips and training sessions from experienced players.",
      gradient: "from-accent to-secondary",
    },
    {
      icon: CheckCircle2,
      title: "Quality Experience",
      description: "Well-planned matches focused on fun and engagement",
      gradient: "from-secondary to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>

      {/* Floating Navigation */}
      <FloatingNav peraLogo={peraLogo} tennisLogo={tennisLogo} />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-8">
        {/* Parallax Background - Tennis Court */}
        <div
          className="parallax-bg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBiYWxsJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ0MTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" style={{ zIndex: 1 }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative" style={{ zIndex: 10 }}>
          {/* Left: Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-64 md:w-full aspect-square max-w-sm md:max-w-lg mx-auto">


              {/* Main tennis image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="relative z-10"
              >
                <img
                  src={tennisLogo}
                  alt="Pera Tennis"
                  className="w-full h-full rounded-full object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Accent circles */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 right-0 w-32 h-32 bg-accent rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 w-40 h-40 bg-primary rounded-full blur-3xl"
              />
            </div>
          </motion.div>

          {/* Right: Hero Text */}
          <div className="space-y-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
                <span className="text-primary">
                  PERA SLAM
                </span>
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
                2026
              </h1>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl md:text-3xl text-white/90"
            >
              Kandy's Largest Tennis Tournament
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-white/70 max-w-md mx-auto md:mx-0"
            >
              Join us for the most prestigious tennis championship in Kandy.
              Three days of intense competition, excellent facilities, and unforgettable moments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Button
                size="lg"
                className="shadow-xl shadow-primary/20"
                onClick={() => document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Register Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground"
                onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Schedule
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.0, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Info Section */}
      <motion.section
        id="info"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-8 bg-gradient-to-br from-gray-50 via-white to-teal-50/30"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tournament Information
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about this year's championship
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-primary/10"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-primary/20">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Tournament Dates</h3>
              <p className="text-muted-foreground text-xs sm:text-base mb-1 sm:mb-2">May 1-3, 2026</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground line-clamp-2">3 days of competitive tennis action</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-secondary/10"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary to-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-secondary/20">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Venue</h3>
              <p className="text-muted-foreground text-xs sm:text-base mb-1 sm:mb-2">Kandy Gardens Club</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Premium Tennis Courts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="bg-white p-5 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-accent/10"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent to-secondary rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-accent/20">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Categories</h3>
              <p className="text-muted-foreground text-xs sm:text-base mb-1 sm:mb-2">5 Age Groups</p>
              <p className="text-[10px] sm:text-sm text-muted-foreground">Singles & Doubles Tournaments</p>
            </motion.div>

            {/* Features (Now part of the same grid) */}
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 3) * 0.1 }}
                className="bg-white p-5 sm:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}
                >
                  <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Match Schedule Section */}
      <motion.section
        id="schedule"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-8 bg-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Match Schedule
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three days of exciting matches and ceremonies
            </p>
          </motion.div>

          {/* Interactive 'Coming Soon' Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-3xl mx-auto mt-8 relative group"
          >
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

            {/* Glossy Card */}
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 p-10 md:p-16 text-center rounded-3xl shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/30"
              >
                <Calendar className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                Schedule & Draws
              </h3>
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Coming Soon</h4>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 font-medium">
                Get your rackets ready! The official match schedule and the comprehensive tournament draw tree will be revealed right here after player registrations close.
              </p>

              <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-bold">
                <Clock className="w-5 h-5 animate-pulse" />
                Stay Tuned
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Rules and Regulations Section */}
      <motion.section
        id="rules"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 px-8 bg-gradient-to-br from-white to-gray-50 border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Rules & Payment Info
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Please read the tournament guidelines and payment structure before proceeding to register.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Rules Block */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-primary/10 hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
              <div className="relative z-10 flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <ScrollText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Tournament Rules</h3>
              </div>
              <div className="space-y-4 relative z-10">

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                  <div className="font-semibold text-foreground flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Juniors (U-12 to U-18)
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed ml-6">
                    <strong>First to reach 7 games.</strong> If the score ties at 6-6, a standard 7-point tiebreaker is played to determine the winner of that 7th game.
                    <br /><span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">Finals: First to reach 2 sets</span>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                  <div className="font-semibold text-foreground flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    Open Matches & Junior Finals
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed ml-6">
                    <strong>First to reach 2 sets.</strong> A player must win two full sets (first to 6 games, leading by 2) to claim the match victory.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                  <div className="font-semibold text-foreground flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    No Advantage Scoring
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed ml-6">
                    Matches use <strong>sudden death at Deuce (40-40)</strong>. Whoever wins the very next point wins the entire game, allowing the tournament to stay perfectly on schedule.
                  </p>
                </div>

              </div>
            </div>

            {/* Payment Block */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-accent/10 hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-0"></div>
              <div className="relative z-10 flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Entry Fees & Payment</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-sm text-muted-foreground mb-1">Singles</div>
                  <div className="text-xl font-bold text-foreground">Rs. 2000</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-sm text-muted-foreground mb-1">Doubles</div>
                  <div className="text-xl font-bold text-foreground">Rs. 2000</div>
                </div>
                <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                  <div className="text-sm text-muted-foreground mb-1">Play Both</div>
                  <div className="text-xl font-bold text-secondary">Rs. 3500</div>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-sm text-muted-foreground mb-1">UoP Students</div>
                  <div className="text-xl font-bold text-primary">Rs. 1500 <span className="text-xs font-normal">per event</span></div>
                </div>
              </div>

              <div className="bg-gray-900 text-white p-6 rounded-2xl relative z-10 shadow-inner">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-accent" />
                  Transfer Details
                </h4>
                <div className="space-y-1 text-sm font-mono text-gray-300">
                  <p><span className="text-gray-500">Bank:</span> Dummy Bank PLC</p>
                  <p><span className="text-gray-500">Name:</span> Pera Slam Tennis</p>
                  <p><span className="text-gray-500">Acct:</span> 1234 5678 9000</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-3xl mx-auto bg-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 text-center"
          >
            <h3 className="text-xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Registration Instructions
            </h3>
            <p className="text-muted-foreground mb-4">
              You must complete your payment bank transfer <strong>before</strong> filling out the form.
              Please capture a screenshot of your successful transaction to upload in the payment receipt section below.
            </p>
            <div className="flex items-center justify-center gap-2 text-foreground font-semibold bg-white inline-flex px-6 py-3 rounded-full shadow-sm">
              <PhoneCall className="w-5 h-5 text-accent" />
              Facing difficulties? Call 077 007 1566
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Registration Form Section with Parallax */}
      <section id="registration-form" className="relative py-24 px-8">
        {/* Parallax Background - Tennis Ball */}
        <div
          className="parallax-bg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBiYWxsJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ0MTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" style={{ zIndex: 1 }} />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative"
          style={{ zIndex: 10 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-white/30"
          >
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Player Registration
            </h2>
            <p className="text-muted-foreground mb-8">Fill in your details to secure your spot in the tournament</p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Registration Successful!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for registering for Pera Slam 2026. Check your email for confirmation details and next steps.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Register Another Player
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={errors.fullName}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                />

                <Select
                  label="Age Category"
                  options={ageCategories}
                  value={formData.ageCategory}
                  onChange={(e) => setFormData({ ...formData, ageCategory: e.target.value })}
                  error={errors.ageCategory}
                />

                <FileUpload
                  label="Payment Receipt"
                  onFileSelect={(file) => setFormData({ ...formData, paymentReceipt: file })}
                  error={errors.paymentReceipt}
                  accept="image/*,.pdf"
                />

                <Button type="submit" size="lg" className="w-full mt-8 shadow-xl shadow-primary/20">
                  Submit Registration
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Wow Footer */}
      <WowFooter />
    </div>
  );
}