"use client";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Users, Info, Trophy, Clock, CheckCircle2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    ageCategory: "",
    paymentReceipt: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const matchSchedule = [
    { date: "March 5", event: "Opening Ceremony & Round 1", time: "9:00 AM" },
    { date: "March 16", event: "Round 2 - Singles & Doubles", time: "8:00 AM" },
    { date: "March 17", event: "Quarter Finals", time: "9:00 AM" },
    { date: "March 18", event: "Semi Finals", time: "10:00 AM" },
    { date: "March 19", event: "Finals Day", time: "2:00 PM" },
    { date: "March 20", event: "Prize Distribution Ceremony", time: "5:00 PM" },
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
                transition={{ delay: 2.8, duration: 0.6 }}
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
              transition={{ delay: 2.6, duration: 0.6 }}
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
              transition={{ delay: 2.8, duration: 0.6 }}
              className="text-2xl md:text-3xl text-white/90"
            >
              The University of Peradeniya Tournament
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.0, duration: 0.6 }}
              className="text-lg text-white/70 max-w-md mx-auto md:mx-0"
            >
              Join us for the most prestigious tennis championship in Kandy.
              Three days of intense competition, excellent facilities, and unforgettable moments.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 0.6 }}
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
          transition={{ delay: 3.4, duration: 2, repeat: Infinity }}
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

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-primary/10"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tournament Dates</h3>
              <p className="text-muted-foreground mb-2">May 1-3, 2026</p>
              <p className="text-sm text-muted-foreground">3 days of competitive tennis action</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-secondary/10"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-secondary/20">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Venue</h3>
              <p className="text-muted-foreground mb-2">Kandy Gardens Club</p>
              <p className="text-sm text-muted-foreground">Premium Tennis Courts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-accent/10"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-accent/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Categories</h3>
              <p className="text-muted-foreground mb-2">5 Age Groups</p>
              <p className="text-sm text-muted-foreground">Singles & Doubles Tournaments</p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
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

          <div className="space-y-4">
            {matchSchedule.map((match, index) => (
              <motion.div
                key={match.date}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 border-primary group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[80px]">
                      <div className="text-2xl font-bold text-primary">{match.date.split(" ")[1]}</div>
                      <div className="text-sm text-muted-foreground">{match.date.split(" ")[0]}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {match.event}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{match.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="md:ml-auto">
                    Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
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