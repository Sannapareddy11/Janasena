import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Terms & Conditions</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Introduction</h2>
            <p className="text-slate-600 leading-7">
              Welcome to JanaSena News. By accessing or using our website, you agree to be bound by these 
              Terms & Conditions. Please read them carefully before using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Acceptance of Terms</h2>
            <p className="text-slate-600 leading-7">
              By accessing and using JanaSena News, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to abide by these terms, please do not 
              use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Use of Content</h2>
            <p className="text-slate-600 leading-7 mb-3">All content on this website, including news articles, images, and other materials, is protected by copyright and other intellectual property laws. You may not:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Reproduce, duplicate, copy, or exploit any content from this website</li>
              <li>Redistribute or republish any content without prior written permission</li>
              <li>Use the content for commercial purposes without authorization</li>
              <li>Modify or alter any content in any way</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">User Accounts</h2>
            <p className="text-slate-600 leading-7 mb-3">If you create an account on our website, you agree to:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Not share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Content Accuracy</h2>
            <p className="text-slate-600 leading-7">
              While we strive to provide accurate and up-to-date information, we make no representations or warranties 
              of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the 
              content on this website. Any reliance you place on such information is strictly at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Limitation of Liability</h2>
            <p className="text-slate-600 leading-7">
              In no event shall JanaSena News be liable for any indirect, incidental, special, consequential, or 
              punitive damages arising out of or related to your use of this website, whether based on contract, 
              tort, strict liability, or any other legal theory.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Prohibited Activities</h2>
            <p className="text-slate-600 leading-7 mb-3">You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Using the website for any illegal purpose</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with or disrupting the website or servers</li>
              <li>Posting or transmitting harmful or offensive content</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Modifications to Terms</h2>
            <p className="text-slate-600 leading-7">
              We reserve the right to modify these terms at any time. Your continued use of the website after any 
              changes constitutes acceptance of the new terms. We will notify users of significant changes via email 
              or website notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Governing Law</h2>
            <p className="text-slate-600 leading-7">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes 
              arising under these terms shall be subject to the exclusive jurisdiction of the courts in Andhra Pradesh, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-7">
              If you have any questions about these Terms & Conditions, please contact us at:
              janasenanews@gmail.com
            </p>
          </section>

          <section>
            <p className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
