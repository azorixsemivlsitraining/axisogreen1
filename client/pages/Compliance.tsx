import * as React from "react";
import { ShieldCheck, FileCheck, Globe, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Compliance() {
  const certifications = [
    {
      icon: <Award className="w-6 h-6 text-solar-600" />,
      title: "ISO 9001",
      desc: "Quality Management System certification ensuring consistent processes and continuous improvement.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-solar-600" />,
      title: "ISO 14001",
      desc: "Environmental Management System certification focused on sustainability and eco-responsibility.",
    },
    {
      icon: <FileCheck className="w-6 h-6 text-solar-600" />,
      title: "IEC Standards",
      desc: "Compliance with international IEC standards for solar panels, wind turbines, and energy storage systems.",
    },
    {
      icon: <Globe className="w-6 h-6 text-solar-600" />,
      title: "Government Regulatory Approvals",
      desc: "Adhering to local, national, and global renewable energy compliance regulations and policies.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-solar-600 to-energy-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Compliance & Certifications</h1>
          <p className="text-lg max-w-2xl mx-auto">
            At AXISO Green Energy, we are committed to meeting international standards,
            regulatory requirements, and certifications to deliver reliable and sustainable
            energy solutions.
          </p>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Our Certifications & Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {certifications.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-solar-100 p-3 rounded-full">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Our Commitment to Compliance
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            We align our operations with industry standards and regulatory frameworks to
            ensure the safety, efficiency, and sustainability of our renewable energy
            solutions. From ISO-certified processes to government approvals, compliance is
            at the core of everything we do.
          </p>
          <div className="flex justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-solar-600 text-white font-medium rounded-lg shadow hover:bg-solar-700 transition"
            >
              Contact Us for Compliance Details
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
