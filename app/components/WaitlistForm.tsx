'use client';

import React, { useState } from 'react';

const BLOCKED_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com'];

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', linkedIn: '', icp: '', dealSize: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Corporate email is required';
    } else {
      const emailDomain = formData.email.split('@')[1]?.toLowerCase();
      if (!emailDomain || BLOCKED_DOMAINS.includes(emailDomain)) {
        newErrors.email = 'Please use your active corporate email address.';
      }
    }
    if (!formData.linkedIn.includes('linkedin.com/in/')) {
      newErrors.linkedIn = 'Must be a valid LinkedIn URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // The Real API Call
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsSuccess(true);
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch (error) {
        alert('Network error. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-2">Application Received.</h3>
        <p className="text-slate-400">Check your inbox for your founding member credits.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="First Name" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
        <input type="text" placeholder="Last Name" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
      </div>
      <div>
        <input type="email" placeholder="Corporate Email" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <input type="text" placeholder="LinkedIn URL" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white" onChange={(e) => setFormData({...formData, linkedIn: e.target.value})} />
        {errors.linkedIn && <p className="text-red-400 text-xs mt-1">{errors.linkedIn}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg">
        {isSubmitting ? 'Sending...' : 'Submit Application'}
      </button>
    </form>
  );
}