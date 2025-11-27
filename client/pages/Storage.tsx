import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ParticleSystem from "@/components/ParticleSystem";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Battery, Settings, ChartLine } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";

export default function Storage() {
  const heroRef = useRef(null);
  const listRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const isListInView = useInView(listRef, { once: true, margin: "-100px" });
  const [imageIndex, setImageIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const storageImages = [
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F91bfe972fc9d40d3bc13c8e58f3008a6?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff5d1a76f6ce1498da6dd24ab6908705e?format=webp&width=800",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F56b22c1148004aef98123ac0296a0564?format=webp&width=800",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((p) => (p + 1) % storageImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [storageImages.length]);

  const highlights = [
    {
      icon: Battery,
      title: "Battery Energy Storage Systems",
      desc: "Front-of-meter and behind-the-meter battery systems for peak shaving, backup and grid services.",
    },
    {
      icon: ChartLine,
      title: "Energy Management",
      desc: "Advanced EMS and controls to optimize dispatch, arbitrage and reliability.",
    },
    {
      icon: Settings,
      title: "O&M & Lifecycle",
      desc: "Warranty, testing, and long-term operations to ensure safe and reliable performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section
          ref={heroRef}
          className="relative min-h-screen bg-black overflow-hidden flex items-center"
        >
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
                src="https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F91bfe972fc9d40d3bc13c8e58f3008a6?format=webp&width=800"
                alt="Battery Energy Storage System"
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
                src="https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff5d1a76f6ce1498da6dd24ab6908705e?format=webp&width=800"
                alt="Industrial Storage Facility"
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
                src="https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F56b22c1148004aef98123ac0296a0564?format=webp&width=800"
                alt="Grid-Scale Battery Systems"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
          </div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Text Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <div className="w-full flex justify-start mb-6">
              <BackButton to="/solutions" label="Back to Solutions" />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            >
              Energy Storage
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={
                isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-xl text-gray-100 max-w-3xl mx-auto drop-shadow-lg"
            >
              Battery energy storage solutions to enhance grid resilience,
              provide ancillary services and increase renewable penetration.
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
                to="/get-quote#commercial"
                className="inline-block px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-105 transition-transform"
              >
                Request Quote
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Energy Storage Gallery */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Energy Storage Infrastructure
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Advanced battery systems and energy management solutions powering the grid
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  url: "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F91bfe972fc9d40d3bc13c8e58f3008a6?format=webp&width=800",
                  title: "Battery Energy Storage System",
                  delay: 0,
                },
                {
                  url: "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff5d1a76f6ce1498da6dd24ab6908705e?format=webp&width=800",
                  title: "Industrial Storage Facility",
                  delay: 0.1,
                },
                {
                  url: "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F56b22c1148004aef98123ac0296a0564?format=webp&width=800",
                  title: "Grid-Scale Battery Systems",
                  delay: 0.2,
                },
              ].map((image, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: image.delay }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-lg shadow-lg"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white font-semibold p-4">{image.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={listRef} className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold mb-6">Storage Highlights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="group"
                >
                  <Card className="h-full bg-white">
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
                Energy storage for a flexible grid
              </motion.h3>
              <p className="opacity-90">
                We deliver turnkey battery solutions and EMS integrations to
                support grid services and increase renewable adoption.
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
