import React, { useState } from 'react';
import API from '../services/api';

const DataDeletionRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await API.post('/deletion-request', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit deletion request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Account & Data Deletion Request</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">About JanaSena News</h2>
            <p className="text-slate-600 leading-7">
              JanaSena News is a news platform dedicated to providing coverage of JanaSena Party activities, 
              leadership, public meetings, political developments, and community initiatives in Andhra Pradesh & Telangana, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">How to Request Account Deletion</h2>
            <p className="text-slate-600 leading-7 mb-4">
              To request deletion of your JanaSena News account and all associated personal data, please follow these steps:
            </p>
            <ol className="list-decimal list-inside text-slate-600 space-y-3 ml-4">
              <li>Fill out the deletion request form below with your registered email address</li>
              <li>Provide your full name as registered in your account</li>
              <li>Optionally, provide a reason for your deletion request</li>
              <li>Submit the form and wait for confirmation via email</li>
              <li>Your account and data will be permanently deleted within 30 days of confirmation</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data That Will Be Deleted</h2>
            <p className="text-slate-600 leading-7 mb-3">
              Upon approval of your deletion request, the following data associated with your account will be permanently deleted:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li><strong>Personal Information:</strong> Name, email address, and any profile information</li>
              <li><strong>Account Credentials:</strong> Password and authentication tokens</li>
              <li><strong>User Activity Data:</strong> Login history, view history, and interaction data</li>
              <li><strong>Preferences:</strong> Any saved preferences, bookmarks, or custom settings</li>
              <li><strong>Comments/Feedback:</strong> Any comments or feedback submitted by you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data That Will Be Retained</h2>
            <p className="text-slate-600 leading-7 mb-3">
              The following data may be retained for legal, security, or operational purposes even after account deletion:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
              <li><strong>Anonymous Usage Data:</strong> Aggregated analytics and usage statistics (no personal identifiers)</li>
              <li><strong>Legal Compliance:</strong> Data required to be retained by applicable laws and regulations</li>
              <li><strong>Security Logs:</strong> Security-related logs for fraud prevention and system security</li>
              <li><strong>Published Content:</strong> Any news articles or content you published may remain on the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Data Retention Period</h2>
            <p className="text-slate-600 leading-7">
              <strong>30 Days:</strong> Your deletion request will be processed within 30 days of submission. 
              During this period, you can cancel your request by contacting us at janasenanews@gmail.com.
            </p>
            <p className="text-slate-600 leading-7 mt-3">
              <strong>Legal Retention:</strong> Certain data may be retained longer as required by law, 
              typically for up to 7 years for tax and legal compliance purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Submit Deletion Request</h2>
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  ✓ Your deletion request has been submitted successfully. We will process it within 30 days.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name (as registered in account)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DA2824] focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DA2824] focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Deletion (Optional)
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#DA2824] focus:border-transparent outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Please let us know why you want to delete your account..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DA2824] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#b91e1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Deletion Request'}
              </button>
            </form>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black mb-2">Important Notice</h3>
            <p className="text-slate-600 leading-7">
              Once your account is deleted, this action cannot be undone. You will lose access to all 
              account features and data. Please ensure you have backed up any important information before 
              submitting this request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-7">
              If you have any questions about the deletion process or need to cancel your request, 
              please contact us at: <strong>janasenanews@gmail.com</strong>
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

export default DataDeletionRequest;
