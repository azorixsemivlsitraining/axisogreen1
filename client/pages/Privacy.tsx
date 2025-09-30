import * as React from "react";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-solar-600 to-energy-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Learn how AXISO Green collects, uses, and protects your data while
            ensuring transparency and trust.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12 text-gray-700">
          {/* Introduction */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Introduction
            </h2>
            <p>
              At <span className="font-medium">AXISO Green Energy</span>, we
              value your privacy and are committed to protecting your personal
              information. This Privacy Policy explains how we collect, use, and
              safeguard your data when you interact with our website and
              services.
            </p>
          </div>

          {/* Information Collection */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-medium">Personal Information:</span>{" "}
                includes your name, email address, phone number, and contact
                details when you submit forms or inquiries.
              </li>
              <li>
                <span className="font-medium">Usage Data:</span> such as pages
                visited, browser type, and IP address to improve website
                experience.
              </li>
              <li>
                <span className="font-medium">Cookies:</span> small files stored
                on your device to remember preferences and track performance.
              </li>
            </ul>
          </div>

          {/* Usage of Data */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and improve our services</li>
              <li>To respond to inquiries and customer support requests</li>
              <li>To send updates, newsletters, and promotional materials</li>
              <li>To comply with legal and regulatory obligations</li>
            </ul>
          </div>

          {/* Data Protection */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              personal data from unauthorized access, disclosure, alteration, or
              destruction. However, no method of transmission over the internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* User Rights */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p>
              You have the right to access, update, or request deletion of your
              personal information. To exercise these rights, please contact us
              at{" "}
              <a
                href="mailto:privacy@axisogreen.in"
                className="text-solar-600 underline"
              >
                privacy@axisogreen.in
              </a>
              .
            </p>
          </div>

          {/* Updates */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technology, or legal requirements. The
              updated version will always be available on this page.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy or how we
              handle your data, please contact us at{" "}
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
