import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Introduction</h2>
            <p className="text-slate-600 leading-7">
              Welcome to JanaSena News. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Information We Collect</h2>
            <p className="text-slate-600 leading-7 mb-3">We may collect, use, store and transfer different kinds of personal data about you, which we group together as follows:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li><strong>Identity Data:</strong> includes name, username or similar identifier</li>
              <li><strong>Contact Data:</strong> includes email address and telephone numbers</li>
              <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version</li>
              <li><strong>Usage Data:</strong> includes information about how you use our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 leading-7 mb-3">We use your personal data for the following purposes:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>To provide and maintain our news service</li>
              <li>To manage user accounts and authentication</li>
              <li>To send you notifications and updates</li>
              <li>To analyze and improve our website performance</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data Security</h2>
            <p className="text-slate-600 leading-7">
              We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
              used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to employees 
              who need to know for processing it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Your Rights</h2>
            <p className="text-slate-600 leading-7 mb-3">Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-7">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
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

export default PrivacyPolicy;
