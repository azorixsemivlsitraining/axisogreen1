import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Target, Heart, Users, Award } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ParticleSystem from "@/components/ParticleSystem";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AboutAnimatedHero() {
  const ref = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const baseGallery = [
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F31511583a0bf47cbac17e9b0a6ba7540?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff7ce032612c5498295baa33ffba37099?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Fdcd6b34456de4036807c67a6c9204668?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff2f741599e214ed18cbf4fe15b9a22bb?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F0c65c8f98b434f6fa3e56549998067c6?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Fdbef869499544752866057ac9194e8ed?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ffadfc97438934d1f879226e9ef0a7f52?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F7a0c784efd084521887758d90c4b2346?format=webp&width=1200",
  ];
  const removeSet = new Set([
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F47492e7ccdcf4219a35fd0948d46120d?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Fe0bf12985a064d7c884bafc93c0f7237?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F49b0b1bb88dc45a6987bc809295d0206?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2F77dd36b975ca431a870392e1e863fc0d?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Ff671c324bf734df1a355b4123cd0ad13?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Fa43b35eb839444f3861d83694fc86dfd?format=webp&width=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F5c07bd532d434c36b4bb2918deeee627%2Fc7f82419ad114e0baa3a75b074f2233d?format=webp&width=1200",
  ]);
  const gallery = baseGallery.filter((u) => !removeSet.has(u));

  const slides = [
    {
      id: 1,
      title: "Our Vision",
      subtitle: "Leading the Green Revolution",
      description:
        "We envision a world powered entirely by clean, renewable energy where every home, business, and community thrives sustainably.",
      icon: Target,
      stats: { founded: "2008", team: "200+", impact: "Global" },
      gradient: "from-solar-400 via-energy-500 to-sky-500",
      animation: "vision",
    },
    {
      id: 2,
      title: "Our Mission",
      subtitle: "Empowering Sustainable Tomorrow",
      description:
        "To accelerate the world's transition to renewable energy through innovative solutions, expert guidance, and unwavering commitment to excellence.",
      icon: Heart,
      stats: { projects: "950+", capacity: "250MW", savings: "$50M+" },
      gradient: "from-energy-400 via-solar-500 to-sky-600",
      animation: "mission",
    },
    {
      id: 3,
      title: "Our Values",
      subtitle: "Principles That Guide Us",
      description:
        "Innovation, sustainability, integrity, and excellence drive everything we do as we build a cleaner, brighter future for all.",
      icon: Award,
      stats: {
        innovation: "1st",
        sustainability: "100%",
        excellence: "Always",
      },
      gradient: "from-sky-400 via-energy-500 to-solar-600",
      animation: "values",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const t = setInterval(() => {
      setImageIndex((p) => (p + 1) % gallery.length);
    }, 4000);
    return () => clearInterval(t);
  }, [gallery.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];
  const CurrentIcon = currentSlideData.icon;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-solar-50 via-energy-50 to-sky-50"
    >
      {/* Solar-themed Particle System */}
      <ParticleSystem
        particleCount={80}
        colors={["#FFD700", "#FFA500", "#FF8C00", "#4169E1"]}
        className="opacity-30"
      />


      <motion.div
        style={{ y, opacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">
          {/* Left content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 30, y: -20 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Badge with Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-solar-100 to-energy-100 backdrop-blur-sm text-solar-700 rounded-full text-sm font-medium mb-6 lg:mb-8 border border-solar-200"
                >
                  <CurrentIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                  {currentSlideData.subtitle}
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 lg:mb-8 leading-tight break-words"
                >
                  <motion.span
                    className={`block bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent`}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "300% 300%" }}
                  >
                    {currentSlideData.title}
                  </motion.span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 lg:mb-12 max-w-2xl lg:max-w-3xl leading-relaxed"
                >
                  {currentSlideData.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex flex-col sm:flex-row lg:flex-row gap-4 lg:gap-6 justify-center lg:justify-start mb-8 lg:mb-12"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(255, 165, 0, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className={`bg-gradient-to-r ${currentSlideData.gradient} hover:shadow-2xl group text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 h-auto text-white border-0 w-full sm:w-auto`}
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 transition-transform group-hover:translate-x-2" />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="group border-2 border-solar-300 hover:border-solar-500 text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 h-auto backdrop-blur-sm hover:bg-solar-50 w-full sm:w-auto"
                        >
                          <Play className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                          Our Story
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 overflow-hidden">
                        <DialogHeader className="sr-only">
                          <DialogTitle>Our Story</DialogTitle>
                          <DialogDescription>About Axiso Green Energy video</DialogDescription>
                        </DialogHeader>
                        <div className="aspect-video w-full">
                          <video
                            src="https://cdn.builder.io/o/assets%2F5c07bd532d434c36b4bb2918deeee627%2F9534ea4faebe4071976effc1ce08eec0?alt=media&token=7abcbb20-91b3-49c3-be8d-fa5b0d81725a&apiKey=5c07bd532d434c36b4bb2918deeee627"
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 pt-6 lg:pt-8 border-t border-solar-200"
                >
                  {Object.entries(currentSlideData.stats).map(
                    ([key, value], index) => (
                      <motion.div
                        key={key}
                        className="text-center lg:text-left group cursor-pointer"
                        whileHover={{ scale: 1.05, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-solar-600 to-energy-600 bg-clip-text text-transparent"
                          animate={{
                            backgroundPosition: ["0%", "100%", "0%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        >
                          {value}
                        </motion.div>
                        <div className="text-sm text-muted-foreground capitalize group-hover:text-foreground transition-colors">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </motion.div>
                    ),
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right content - Animated Image Gallery */}
          <motion.div
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imageIndex}
                  src={gallery[imageIndex]}
                  alt="Axiso gallery"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.2, scale: 1.02 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>

            {/* Navigation Dots - Mobile Friendly */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-solar-500 w-8"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Floating Mobile-Friendly Elements */}
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-2xl shadow-lg ${
                  i === 0
                    ? "bg-solar-400/20 -top-3 -right-3 lg:-top-6 lg:-right-6"
                    : "bg-energy-400/20 -bottom-3 -left-3 lg:-bottom-6 lg:-left-6"
                }`}
                animate={{
                  y: [0, -10, 0],
                  rotateX: [0, 180, 360],
                  rotateY: [0, 180, 360],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                style={{ transformStyle: "preserve-3d" }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
}
