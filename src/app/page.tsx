"use client";
import { useState, useEffect, FormEvent } from "react";
import imageCompression from "browser-image-compression";
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
import firstPoster from "@/assets/first.jpeg";
import secondPoster from "@/assets/second.jpeg";
import thirdPoster from "@/assets/third.png";

const peraLogo = peraLogoImg.src; // Placeholder for university logo
const tennisLogo = tennisLogoImg.src;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  singlesCategories: string[];
  doublesCategories: string[];
  partnerNames: { [key: string]: string };
  pastAchievements: string;
  isUoPStudent: boolean;
  uopRegNumber: string;
  paymentOption: "paid" | "cash";
  paymentReceipt: File | null;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  categories?: string;
  partnerNames?: { [key: string]: string };
  uopRegNumber?: string;
  paymentReceipt?: string;
}

const tournamentCategories = [
  { value: "", label: "Select Category" },
  { value: "boys-u-12", label: "Boys Under 12" },
  { value: "girls-u-12", label: "Girls Under 12" },
  { value: "boys-u-14", label: "Boys Under 14" },
  { value: "girls-u-14", label: "Girls Under 14" },
  { value: "boys-u-16", label: "Boys Under 16" },
  { value: "girls-u-16", label: "Girls Under 16" },
  { value: "boys-u-18", label: "Boys Under 18" },
  { value: "girls-u-18", label: "Girls Under 18" },
  { value: "mens", label: "Men's Open" },
  { value: "womens", label: "Women's Open" },
  { value: "mixed", label: "Mixed Open" },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    singlesCategories: [],
    doublesCategories: [],
    partnerNames: {},
    pastAchievements: "",
    isUoPStudent: false,
    uopRegNumber: "",
    paymentOption: "paid",
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
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, "");
      if (digitsOnly.length !== 10 && !(digitsOnly.length === 11 && digitsOnly.startsWith("94"))) {
        newErrors.phone = "Invalid phone number";
      }
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }

    const allCategories = [...formData.singlesCategories, ...formData.doublesCategories];
    if (allCategories.length === 0) {
      newErrors.categories = "Please select at least one tournament category (Singles or Doubles)";
    }

    if (formData.dob) {
      const cutoffDate = new Date("2026-05-01");
      const birthDate = new Date(formData.dob);
      let age = cutoffDate.getFullYear() - birthDate.getFullYear();
      const m = cutoffDate.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && cutoffDate.getDate() < birthDate.getDate())) {
        age--;
      }

      const checkAge = (level: number) => {
        if (allCategories.some(c => c.includes(`u-${level}`)) && age > level) {
          newErrors.dob = `You must be ${level} or under as of May 1st, 2026 to play in U-${level}.`;
        }
      };

      checkAge(12);
      if (!newErrors.dob) checkAge(14);
      if (!newErrors.dob) checkAge(16);
      if (!newErrors.dob) checkAge(18);
    }

    if (formData.doublesCategories.length > 0) {
      const pErrors: { [key: string]: string } = {};
      let hasError = false;
      formData.doublesCategories.forEach(cat => {
        if (!formData.partnerNames[cat]?.trim()) {
          pErrors[cat] = "Partner's name is required";
          hasError = true;
        }
      });
      if (hasError) {
        newErrors.partnerNames = pErrors;
      }
    }

    const hasOpenCategory = allCategories.includes("mens") || allCategories.includes("womens") || allCategories.includes("mixed");
    if (
      hasOpenCategory &&
      formData.isUoPStudent &&
      !formData.uopRegNumber.trim()
    ) {
      newErrors.uopRegNumber = "Registration number is required for UoP students";
    }

    if (formData.paymentOption === "paid" && !formData.paymentReceipt) {
      newErrors.paymentReceipt = "Payment receipt is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        let base64File = "";
        let fileName = "";
        let mimeType = "";

        // Compress and convert the image file to Base64 so it can be sent via JSON
        if (formData.paymentReceipt) {
          let fileToProcess = formData.paymentReceipt as File;

          if (fileToProcess.type.startsWith("image/")) {
            try {
              fileToProcess = await imageCompression(fileToProcess, {
                maxSizeMB: 0.3, // Compress down to max 300KB
                maxWidthOrHeight: 1024,
                useWebWorker: true,
              });
            } catch (err) {
              console.warn("Compression failed, using original", err);
            }
          }

          fileName = fileToProcess.name;
          mimeType = fileToProcess.type;
          base64File = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileToProcess);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        }

        const eventType = formData.singlesCategories.length > 0 && formData.doublesCategories.length > 0
          ? "both"
          : formData.singlesCategories.length > 0
            ? "singles"
            : formData.doublesCategories.length > 0 ? "doubles" : "singles";

        const formattedCategories = [
          ...formData.singlesCategories.map(c => `${c} (Singles)`),
          ...formData.doublesCategories.map(c => `${c} (Doubles)`)
        ];

        const formattedPartnerName = formData.doublesCategories.map(cat => {
          const catLabel = tournamentCategories.find(c => c.value === cat)?.label || cat;
          return `${catLabel}: ${formData.partnerNames[cat] || ''}`;
        }).join(', ');

        const { partnerNames, ...restFormData } = formData;

        const payload = {
          ...restFormData,
          partnerName: formattedPartnerName,
          categories: formattedCategories,
          eventType: eventType,
          paymentReceipt: base64File,
          fileName,
          mimeType,
        };

        // === IMPORTANT: PASTE YOUR GOOGLE APPS SCRIPT URL HERE ===
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-0XKx9Yfz9wH_2ZD3E9AVL_fwrpFXRSkL7KhGkpA56QLMCL4bFYk3riDFJ-phJYdSHA/exec";

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(payload), // Send as plain text JSON to avoid CORS preflight issues
        });

        const result = await response.json();

        if (result.result === "success") {
          setIsSubmitted(true);
          console.log("Form submitted successfully!");
        } else {
          console.error("Script error:", result.error);
          alert("There was an issue submitting your registration. Please try again.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error: Could not connect to the server. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    }
  };



  const features = [
    {
      icon: Trophy,
      title: "Championship Trophy",
      description: "Compete for the prestigious Pera Slam Championship trophy.",
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
    <div className="min-h-screen bg-black relative">
      {/* Global Parallax Background */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjBiYWxsJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ0MTMyODd8MA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.5) contrast(1.1)',
          zIndex: 0
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black/80 pointer-events-none" style={{ zIndex: 1 }} />

      <div className="relative z-10 w-full h-full flex flex-col">
        <AnimatePresence>
          {isLoading && <Preloader />}
        </AnimatePresence>

        {/* Floating Navigation */}
        <FloatingNav peraLogo={peraLogo} tennisLogo={tennisLogo} />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative" style={{ zIndex: 10 }}>
            {/* Left: Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-64 md:w-full aspect-square max-w-sm md:max-w-lg mx-auto">


                {/* Main tennis image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
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
                transition={{ duration: 0.6 }}
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
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl text-white/90"
              >
                Kandy's Largest Tennis Tournament
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-lg text-white/70 max-w-md mx-auto md:mx-0"
              >
                Join us for the most prestigious tennis championship in Kandy.
                Three days of intense competition and unforgettable moments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
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
            transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
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
          className="relative py-24 px-4 sm:px-8"
        >
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-2xl border border-white/15 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-16 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary drop-shadow-md">
                Tournament Information
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg drop-shadow">
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
                className="bg-white/10 backdrop-blur-md p-5 sm:p-8 rounded-3xl shadow-2xl hover:bg-white/20 transition-all border border-white/20 text-white"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-primary/20">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">Tournament Dates</h3>
                <p className="text-white/90 text-xs sm:text-base mb-1 sm:mb-2">May 1,2,3 2026</p>
                <p className="text-[10px] sm:text-sm text-white/70 line-clamp-2">3 days of competitive tennis action</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-white/10 backdrop-blur-md p-5 sm:p-8 rounded-3xl shadow-2xl hover:bg-white/20 transition-all border border-white/20 text-white"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary to-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-secondary/20">
                  <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">Venue</h3>
                <p className="text-white/90 text-xs sm:text-base mb-1 sm:mb-2">Kandy Gardens Club</p>
                <p className="text-[10px] sm:text-sm text-white/70">Premium Tennis Courts</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -8 }}
                className="bg-white/10 backdrop-blur-md p-5 sm:p-8 rounded-3xl shadow-2xl hover:bg-white/20 transition-all border border-white/20 text-white"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent to-secondary rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-accent/20">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white">Categories</h3>
                <p className="text-white/90 text-xs sm:text-base mb-1 sm:mb-2">Boys, Girls & Open</p>
                <p className="text-[10px] sm:text-sm text-white/70">Boys & Girls U-12, U-14, U-16, U-18, Men's, Women's Singles & Doubles Tournaments</p>
              </motion.div>

              {/* Features (Now part of the same grid) */}
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index + 3) * 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-5 sm:p-8 rounded-3xl shadow-2xl hover:bg-white/20 transition-all border border-white/20 group text-white"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/70 text-xs sm:text-sm">{feature.description}</p>
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
          className="py-24 px-4 sm:px-8 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10 bg-gradient-to-br from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-2xl border border-white/15 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-16 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary drop-shadow-md">
                Schedule & Draws
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg drop-shadow">
                Official tournament schedule and match draws are now available.
              </p>
            </motion.div>

            {/* Order of Play Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto mb-16"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-3">
                <Clock className="w-7 h-7 text-primary" />
                Order of Play
                <Clock className="w-7 h-7 text-primary" />
              </h3>

              {/* Friday Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>

                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between rounded-3xl shadow-2xl text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-bl-full blur-3xl -z-10"></div>

                  <div className="flex items-center gap-6 mb-6 md:mb-0 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 shrink-0 relative">
                      <Calendar className="w-8 h-8 text-white" />
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">Day 1</span>
                    </div>
                    <div>
                      <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-1">May 1st, 2026</p>
                      <h4 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">Friday — Order of Play</h4>
                      <p className="text-white/70 text-sm mt-1">Full schedule of matches for Day 1</p>
                    </div>
                  </div>

                  <a
                    href="/draws/order_of_play_friday.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-primary text-white hover:bg-primary/90 transition-all rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 duration-200 shrink-0"
                  >
                    <Download className="w-5 h-5" />
                    View PDF
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Draws Grid */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-10 flex items-center justify-center gap-3">
                <Trophy className="w-8 h-8 text-accent" />
                Tournament Draws
                <Trophy className="w-8 h-8 text-accent" />
              </h3>

              {/* Category groups */}
              {[
                {
                  category: "Boys Under 12",
                  color: "from-blue-500 to-cyan-400",
                  accent: "blue",
                  draws: [
                    { event: "Singles", link: "/draws/boys_u12_singles.pdf" },
                    { event: "Doubles", link: "/draws/boys_u12_doubles.pdf" },
                  ],
                },
                {
                  category: "Girls Under 12",
                  color: "from-pink-500 to-rose-400",
                  accent: "pink",
                  draws: [
                    { event: "Singles", link: "/draws/girls_u12_singles.pdf" },
                  ],
                },
                {
                  category: "Boys Under 14",
                  color: "from-blue-500 to-cyan-400",
                  accent: "blue",
                  draws: [
                    { event: "Singles", link: "/draws/boys_u14_singles.pdf" },
                    { event: "Doubles", link: "/draws/boys_u14_doubles.pdf" },
                  ],
                },
                {
                  category: "Girls Under 14",
                  color: "from-pink-500 to-rose-400",
                  accent: "pink",
                  draws: [
                    { event: "Singles", link: "/draws/girls_u14_singles.pdf" },
                    { event: "Doubles", link: "/draws/girls_u14_doubles.pdf" },
                  ],
                },
                {
                  category: "Boys Under 16",
                  color: "from-blue-500 to-cyan-400",
                  accent: "blue",
                  draws: [
                    { event: "Singles", link: "/draws/boys_u16_singles.pdf" },
                    { event: "Doubles", link: "/draws/boys_u16_doubles.pdf" },
                  ],
                },
                {
                  category: "Girls Under 16",
                  color: "from-pink-500 to-rose-400",
                  accent: "pink",
                  draws: [
                    { event: "Singles", link: "/draws/girls_u16_singles.pdf" },
                  ],
                },
                {
                  category: "Boys Under 18",
                  color: "from-blue-500 to-cyan-400",
                  accent: "blue",
                  draws: [
                    { event: "Singles", link: "/draws/boys_u18_singles.pdf" },
                    { event: "Doubles", link: "/draws/boys_u18_doubles.pdf" },
                  ],
                },
                {
                  category: "Girls Under 18",
                  color: "from-pink-500 to-rose-400",
                  accent: "pink",
                  draws: [
                    { event: "Singles", link: "/draws/girls_u18_singles.pdf" },
                  ],
                },
                {
                  category: "Men's Open",
                  color: "from-indigo-500 to-purple-500",
                  accent: "indigo",
                  draws: [
                    { event: "Singles", link: "/draws/mens_singles.pdf" },
                    { event: "Doubles", link: "/draws/mens_doubles.pdf" },
                  ],
                },
                {
                  category: "Women's Open",
                  color: "from-violet-500 to-fuchsia-500",
                  accent: "violet",
                  draws: [
                    { event: "Singles", link: "/draws/womens_singles.pdf" },
                    { event: "Doubles", link: "/draws/womens_doubles.pdf" },
                  ],
                },
                {
                  category: "Mixed Open",
                  color: "from-orange-500 to-amber-400",
                  accent: "orange",
                  draws: [
                    { event: "Doubles", link: "/draws/mixed_doubles.pdf" },
                  ],
                },
              ].map((group, idx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:bg-white/10 transition-all mb-4"
                >
                  {/* Left accent bar */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${group.color}`}></div>

                  <div className="pl-6 pr-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Category title */}
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center shadow-lg shrink-0`}>
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-white">{group.category}</h4>
                    </div>

                    {/* Download buttons for each event */}
                    <div className="flex gap-3 flex-wrap">
                      {group.draws.map((draw) => (
                        <a
                          key={draw.event}
                          href={draw.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${group.color} text-white text-sm font-semibold rounded-full shadow-md hover:opacity-90 hover:scale-105 transition-all duration-200`}
                        >
                          <Download className="w-4 h-4" />
                          {draw.event}
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Rules and Regulations Section */}
        <motion.section
          id="rules"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-24 px-4 sm:px-8 relative"
        >
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-900/70 via-gray-800/70 to-gray-900/70 backdrop-blur-2xl border border-white/15 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-16 shadow-2xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary drop-shadow-md">
                Rules & Payment Info
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto text-lg drop-shadow">
                Please read the tournament guidelines and payment structure before proceeding to register.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Rules Block */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 hover:bg-white/15 transition-all relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-2xl -z-0"></div>
                <div className="relative z-10 flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <ScrollText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Tournament Rules</h3>
                </div>
                <div className="space-y-4 relative z-10">

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                    <div className="font-semibold text-white flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      Juniors (U-12 to U-18)
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed ml-6">
                      <strong className="text-white">First to reach 6 games.</strong> If the score ties at 5-5, a standard 7-point tiebreaker is played to determine the winner of that 7th game.
                      <br /><span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary-50 text-xs font-bold rounded">Finals: First to reach 2 sets</span>
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                    <div className="font-semibold text-white flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      Open Matches & Junior Finals
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed ml-6">
                      <strong className="text-white">First to reach 2 sets.</strong> A player must win two full sets (first to 4 games, leading by 2) to claim the match victory. if 1-1 then tightbeaker of 7 points.
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                    <div className="font-semibold text-white flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      No Advantage Scoring
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed ml-6">
                      Matches use <strong className="text-white">sudden death at Deuce (40-40)</strong>. Whoever wins the very next point wins the entire game, allowing the tournament to stay perfectly on schedule.
                    </p>
                  </div>

                </div>
              </div>

              {/* Payment Block */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/20 hover:bg-white/15 transition-all relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-bl-full blur-2xl -z-0"></div>
                <div className="relative z-10 flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Entry Fees & Payment</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-sm text-white/70 mb-1">Singles</div>
                    <div className="text-xl font-bold text-white">Rs. 2000</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-sm text-white/70 mb-1">Doubles</div>
                    <div className="text-xl font-bold text-white">Rs. 2000</div>
                  </div>
                  <div className="p-4 bg-accent/20 rounded-xl border border-accent/30">
                    <div className="text-sm text-white/80 mb-1">Play Both</div>
                    <div className="text-xl font-bold text-accent">Rs. 3500</div>
                  </div>
                  <div className="p-4 bg-primary/20 rounded-xl border border-primary/30">
                    <div className="text-sm text-white/80 mb-1">UoP Students</div>
                    <div className="text-xl font-bold text-primary">Rs. 1500 <span className="text-xs font-normal text-white/60">per event</span></div>
                  </div>
                </div>

                {/* Transfer Details hidden for now
                <div className="bg-black/40 backdrop-blur-md text-white p-6 rounded-2xl relative z-10 shadow-inner border border-white/10">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-accent" />
                    Transfer Details
                  </h4>
                  <div className="space-y-1 text-sm font-mono text-gray-300">
                    <p><span className="text-gray-500">Bank: </span>Bank of Ceylon</p>
                    <p><span className="text-gray-500">Name: </span>MS A.N.GUNATHILAKE</p>
                    <p><span className="text-gray-500">Acct: </span>0072891257</p>
                    <p><span className="text-gray-500">Branch: </span>Kandy Teaching Hospital (454)</p>
                  </div>
                </div>
                */}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 max-w-3xl mx-auto bg-primary/20 backdrop-blur-md border border-primary/30 rounded-2xl p-6 md:p-8 text-center text-white"
            >
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center justify-center gap-2 drop-shadow-md">
                <CheckCircle2 className="w-6 h-6" />
                Registration Instructions
              </h3>
              <p className="text-white/80 mb-4 text-lg">
                You can choose to <strong className="text-white">Pay in Cash on the Day</strong> of the tournament, or upload a payment receipt if you have <strong className="text-white">Already Paid</strong> via bank transfer.
              </p>
              <div className="flex items-center justify-center gap-2 text-white font-semibold bg-white/20 backdrop-blur-lg border border-white/20 inline-flex px-6 py-3 rounded-full shadow-lg mb-8">
                <PhoneCall className="w-5 h-5 text-accent" />
                Facing difficulties? Call 077 007 1566
              </div>

              {/* Video Embed */}
              <div className="mt-4 relative max-w-2xl mx-auto rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black/60 backdrop-blur-md p-2">
                <h4 className="text-lg font-semibold text-white/90 mb-3">How to Register</h4>
                <div className="rounded-2xl overflow-hidden bg-black relative aspect-video">
                  <video
                    src="/register_video.mp4"
                    controls
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Registration Form Section */}
        <section id="registration-form" className="relative pt-12 pb-24 px-8 border-t border-white/10">
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
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20"
            >
              <h2 className="text-4xl font-bold mb-2 text-primary text-center">
                Player Registration
              </h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30"
                >
                  <ShieldAlert className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold mb-3 text-primary">
                  Registrations Closed
                </h3>
                <p className="text-muted-foreground mb-6 text-lg max-w-lg mx-auto">
                  Thank you for your interest! The player registration window for Pera Slam 2026 has officially closed. We look forward to seeing you at the tournament!
                </p>
                <div className="flex justify-center mt-6">
                  <Button onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })} variant="outline">
                    View Schedule
                  </Button>
                </div>
              </motion.div>

              <div className="hidden">
                <p className="text-muted-foreground mb-8 text-lg">Fill in your details to secure your spot in the tournament</p>

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
                  <h3 className="text-3xl font-bold mb-3 text-primary">
                    Registration Successful!
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Thank you for registering for Pera Slam 2026. Check your email for confirmation details and next steps.
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Register Another Player
                    </Button>
                  </div>
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

                  <Input
                    label="Date of Birth*"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    error={errors.dob}
                  />

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-black">Tournament Categories & Events*</label>
                    <br />
                    <label className="text-sm font-medium text-black">(Example: You must be 12 or under as of May 1st, 2026 to play in U-12)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Singles Column */}
                      <div className="space-y-3 p-4 border border-white/10 rounded-xl bg-white/5">
                        <div className="font-semibold text-black/90 pb-2 border-b border-white/10">
                          Singles Categories
                        </div>
                        <div className="flex flex-col gap-2">
                          {tournamentCategories.filter(c => c.value !== "" && c.value !== "mixed").map((cat) => (
                            <label key={`singles-${cat.value}`} className="flex items-center gap-2 text-black/90 text-sm cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <input
                                type="checkbox"
                                checked={formData.singlesCategories.includes(cat.value)}
                                onChange={(e) => {
                                  const newCategories = e.target.checked
                                    ? [...formData.singlesCategories, cat.value]
                                    : formData.singlesCategories.filter(c => c !== cat.value);
                                  setFormData({ ...formData, singlesCategories: newCategories });
                                }}
                                className="w-4 h-4 rounded border-white/20 bg-black/20 text-primary focus:ring-primary transition-colors"
                              />
                              {cat.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Doubles Column */}
                      <div className="space-y-3 p-4 border border-white/10 rounded-xl bg-white/5">
                        <div className="font-semibold text-black/90 pb-2 border-b border-white/10">
                          Doubles Categories
                        </div>
                        <div className="flex flex-col gap-2">
                          {tournamentCategories.filter(c => c.value !== "").map((cat) => (
                            <label key={`doubles-${cat.value}`} className="flex items-center gap-2 text-black/90 text-sm cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors">
                              <input
                                type="checkbox"
                                checked={formData.doublesCategories.includes(cat.value)}
                                onChange={(e) => {
                                  const newCategories = e.target.checked
                                    ? [...formData.doublesCategories, cat.value]
                                    : formData.doublesCategories.filter(c => c !== cat.value);
                                  setFormData({ ...formData, doublesCategories: newCategories });
                                }}
                                className="w-4 h-4 rounded border-white/20 bg-black/20 text-primary focus:ring-primary transition-colors"
                              />
                              {cat.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
                  </div>

                  {formData.doublesCategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 space-y-4">
                        <p className="text-sm font-medium text-black">Partner Details</p>
                        {formData.doublesCategories.map(category => {
                          const catLabel = tournamentCategories.find(c => c.value === category)?.label || category;
                          return (
                            <Input
                              key={category}
                              label={`Partner's Name for ${catLabel} *`}
                              placeholder={`Enter partner name`}
                              value={formData.partnerNames[category] || ""}
                              onChange={(e) => setFormData({
                                ...formData,
                                partnerNames: { ...formData.partnerNames, [category]: e.target.value }
                              })}
                              error={errors.partnerNames?.[category]}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {(formData.singlesCategories.includes("mens") || formData.singlesCategories.includes("womens") || formData.doublesCategories.includes("mens") || formData.doublesCategories.includes("womens") || formData.doublesCategories.includes("mixed")) && (
                    <div className="space-y-4 p-5 border border-white/10 rounded-2xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isUoPStudent"
                          checked={formData.isUoPStudent}
                          onChange={(e) => setFormData({ ...formData, isUoPStudent: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 bg-black/20 text-primary focus:ring-primary focus:ring-offset-black transition-colors"
                        />
                        <label htmlFor="isUoPStudent" className="text-black text-sm font-medium cursor-pointer">
                          Are you a University of Peradeniya student?
                        </label>
                      </div>

                      {formData.isUoPStudent && (
                        <div className="pt-2">
                          <Input
                            label="Registration Number"
                            placeholder="e.g. S/19/xxx"
                            value={formData.uopRegNumber}
                            onChange={(e) => setFormData({ ...formData, uopRegNumber: e.target.value })}
                            error={errors.uopRegNumber}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <Input
                    label="Past Achievements (For seeding - Optional)"
                    placeholder="Enter recent tournament wins, rankings, etc."
                    value={formData.pastAchievements}
                    onChange={(e) => setFormData({ ...formData, pastAchievements: e.target.value })}
                  />

                  <div className="space-y-4 p-5 border border-white/10 rounded-2xl bg-white/5">
                    <label className="text-black text-sm font-medium">Payment Option*</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-black/90 text-sm">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="paid"
                          checked={formData.paymentOption === "paid"}
                          onChange={(e) => setFormData({ ...formData, paymentOption: e.target.value as "paid" | "cash" })}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        Already Paid
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-black/90 text-sm">
                        <input
                          type="radio"
                          name="paymentOption"
                          value="cash"
                          checked={formData.paymentOption === "cash"}
                          onChange={(e) => setFormData({ ...formData, paymentOption: e.target.value as "paid" | "cash", paymentReceipt: null })}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        Pay in Cash on the Day
                      </label>
                    </div>
                  </div>

                  {formData.paymentOption === "paid" && (
                    <FileUpload
                      label="Payment Receipt"
                      onFileSelect={(file) => setFormData({ ...formData, paymentReceipt: file })}
                      error={errors.paymentReceipt}
                      accept="image/*,.pdf"
                    />
                  )}

                  <Button type="submit" size="lg" className="w-full mt-8 shadow-xl shadow-primary/20">
                    Submit Registration
                  </Button>
                </form>
              )}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 px-4 relative z-10 border-t border-white/10" id="gallery">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-10 text-primary drop-shadow-md">
              Gallery
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {[firstPoster.src, secondPoster.src, thirdPoster.src].map((posterSrc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-80 sm:h-96 md:h-[420px] rounded-2xl flex-shrink-0 overflow-hidden shadow-2xl border-2 border-white/10 hover:border-primary/50 transition-all bg-black/50 group cursor-pointer"
                >
                  <img src={posterSrc} alt={`Gallery Poster ${index + 1}`} className="h-full w-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Wow Footer */}
        <WowFooter />
      </div>
    </div>
  );
}