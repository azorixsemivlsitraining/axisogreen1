import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Wind as WindIcon,
  Globe,
  Settings,
  ChartLine,
  Shield,
  Monitor,
} from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

export default function Wind() {
  const heroRef = useRef(null);
  const listRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isListInView = useInView(listRef, { once: true, margin: "-100px" });

  const highlights = [
    {
      icon: WindIcon,
      title: "Wind EPC",
      desc: "Project development, turbine procurement and construction for onshore wind farms.",
    },
    {
      icon: Globe,
      title: "Hybrid Systems",
      desc: "Integrated solar-wind hybrid systems for improved capacity factors.",
    },
    {
      icon: Settings,
      title: "Asset Management",
      desc: "O&M, remote monitoring and performance optimization for wind assets.",
    },
  ];

  const windServices = [
    {
      icon: WindIcon,
      title: "Wind EPC Solutions",
      desc: "Complete wind project development and execution",
    },
    {
      icon: Globe,
      title: "Hybrid Solar-Wind Systems",
      desc: "Integrated renewable energy systems",
    },
    {
      icon: Settings,
      title: "Asset Management & O&M",
      desc: "Operations and maintenance services",
    },
    {
      icon: ChartLine,
      title: "Design & Engineering Services",
      desc: "Technical design and engineering consulting",
    },
    {
      icon: Shield,
      title: "Lender's Independent Engineer (LIE)",
      desc: "Independent technical advisory for lenders",
    },
    {
      icon: Monitor,
      title: "Technical Due Diligence for M&A",
      desc: "Due diligence for acquisitions and investments",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section ref={heroRef} className="relative min-h-screen bg-black overflow-hidden flex items-center">
          {/* Hero Images Grid - Sequential animations */}
          <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={
                isHeroInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }
              }
              transition={{ duration: 0.8, delay: 0 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F87fe5c692fd3447b8ee119ccee2af6de?format=webp&width=800"
                alt="Wind Farm Sunset"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={
                isHeroInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F230174b17ee14cbeb44610087ef168e0?format=webp&width=800"
                alt="Wind Turbines"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={
                isHeroInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff6514fdfb79048f3a644677573b061c3?format=webp&width=800"
                alt="Highland Wind Farm"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
          </div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Text Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <div className="w-full flex justify-start mb-6">
              <BackButton />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            >
              Wind Energy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-lg"
            >
              Comprehensive wind energy services including EPC, hybrid
              integrations and asset management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 flex justify-center gap-4"
            >
              <Link
                to="/services"
                className="inline-block px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-105 transition-transform"
              >
                Our Services
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Image + Services grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={
                  isHeroInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.98 }
                }
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center"
              >
                <div className="grid grid-cols-2 gap-4 w-full">
                  {[
                    {
                      url: "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F87fe5c692fd3447b8ee119ccee2af6de?format=webp&width=800",
                      title: "Wind Farm Sunset",
                      delay: 0,
                    },
                    {
                      url: "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F230174b17ee14cbeb44610087ef168e0?format=webp&width=800",
                      title: "Wind Turbines",
                      delay: 0.1,
                    },
                    {
                      url: "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff6514fdfb79048f3a644677573b061c3?format=webp&width=800",
                      title: "Highland Wind Farm",
                      delay: 0.2,
                    },
                  ].map((image, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: image.delay }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <p className="text-white font-semibold p-3 text-sm">{image.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={
                  isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-semibold mb-4">Wind Services</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {windServices.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: idx * 0.06 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-lg bg-white shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <s.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{s.title}</div>
                          <div className="text-muted-foreground text-sm">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section ref={listRef} className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold mb-6">Wind Highlights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isListInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="group"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <h.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{h.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground">
                        {h.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-primary to-green-600 rounded-2xl p-8 text-white">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isListInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.6 }}
                className="text-xl font-bold mb-3"
              >
                Partner with us on wind projects
              </motion.h3>
              <p className="opacity-90">
                We support project development, EPC execution and operations for
                utility-scale and distributed wind deployments.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActionButton />
    </div>
  );
}
