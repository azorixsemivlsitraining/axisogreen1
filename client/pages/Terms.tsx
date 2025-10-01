import * as React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-r from-solar-600 to-energy-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Please read these Terms of Service carefully before using AXISO Green
              Energy’s website and services.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12 text-gray-700">
          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p>
              By accessing or using our website and services, you agree to be
              bound by these Terms of Service. If you do not agree, please do not
              use our services.
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Eligibility
            </h2>
            <p>
              You must be at least 18 years old or have the legal capacity to
              enter into agreements under applicable law to use our services.
            </p>
          </div>

          {/* Use of Services */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Use of Services
            </h2>
            <p>
              You agree to use our services only for lawful purposes and in
              compliance with all applicable laws and regulations. Misuse of our
              services may result in termination of access.
            </p>
          </div>

          {/* Intellectual Property */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Intellectual Property
            </h2>
            <p>
              All content, trademarks, and intellectual property displayed on
              this site are owned by AXISO Green Energy or our licensors. You may
              not copy, distribute, or create derivative works without our
              written consent.
            </p>
          </div>

          {/* Disclaimers */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Disclaimers
            </h2>
            <p>
              Our services are provided "as is" and "as available." We make no
              warranties, express or implied, regarding the reliability,
              accuracy, or availability of our services.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, AXISO Green Energy shall not
              be liable for any damages arising from the use or inability to use
              our services, including indirect or consequential damages.
            </p>
          </div>

          {/* Termination */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your access to our
              services at any time if you violate these Terms.
            </p>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Governing Law
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of India, without regard to conflict of law principles.
            </p>
          </div>

          {/* Updates */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Changes to Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Any changes
              will be posted on this page with an updated effective date.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:info@axisogreen.in"
                className="text-solar-600 underline"
              >
                info@axisogreen.in
              </a>
              .
            </p>
          </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
