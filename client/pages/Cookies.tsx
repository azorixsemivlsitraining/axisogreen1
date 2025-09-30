import * as React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Cookies() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-solar-600 to-energy-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Understand how cookies are used on AXISO Green Energy’s website to
            improve your experience, personalize content, and analyze
            performance.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12 text-gray-700">
          {/* Intro */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files that are stored on your device when
              you visit a website. They help us recognize your browser and
              remember information such as your preferences, login details, and
              browsing activity.
            </p>
          </div>

          {/* Types of Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-medium">Essential Cookies:</span> Required
                for the operation of our website (e.g., login, navigation).
              </li>
              <li>
                <span className="font-medium">Performance Cookies:</span> Help
                us understand how visitors use our site so we can improve it.
              </li>
              <li>
                <span className="font-medium">Functional Cookies:</span> Allow
                the website to remember your choices such as language or region.
              </li>
              <li>
                <span className="font-medium">Advertising Cookies:</span> Used
                to deliver relevant ads and measure their effectiveness.
              </li>
            </ul>
          </div>

          {/* How We Use Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Cookies
            </h2>
            <p>
              We use cookies to enhance your browsing experience, improve
              website functionality, analyze traffic, and provide personalized
              content and advertisements. Cookies also help us ensure security
              and prevent fraudulent activity.
            </p>
          </div>

          {/* Managing Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Managing Your Cookie Preferences
            </h2>
            <p>
              You can control or disable cookies through your browser settings.
              However, please note that disabling certain cookies may affect the
              functionality and user experience of our website.
            </p>
          </div>

          {/* Third-party Cookies */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Third-Party Cookies
            </h2>
            <p>
              We may use third-party services such as analytics and advertising
              providers that also place cookies on your device. These cookies
              are managed by third parties and are subject to their own privacy
              policies.
            </p>
          </div>

          {/* Updates */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Updates to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes
              will be posted on this page with an updated effective date.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about our Cookie Policy, please contact
              us at{" "}
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
    </div>
  );
}
