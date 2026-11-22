'use client';

import { useState, FormEvent } from 'react';
import { BookingData, ServiceTier } from '@/types';

const SERVICE_TIERS: ServiceTier[] = [
  { id: 'essential', name: 'Essential Detail - $299', description: '3-4 hours', price: '$299', duration: '3-4 hours', features: [], icon: '' },
  { id: 'correction', name: 'Paint Correction - $699', description: '6-8 hours', price: '$699', duration: '6-8 hours', features: [], icon: '' },
  { id: 'ceramic', name: 'Ceramic Pro Plus - $1,499', description: '1-2 days', price: '$1,499', duration: '1-2 days', features: [], icon: '' },
];

export const BookingForm = () => {
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    email: '',
    phone: '',
    carModel: '',
    carYear: '',
    serviceTier: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<BookingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        if (!/^[\d\s\-\(\)\+]{10,}$/.test(value)) return 'Invalid phone number';
        break;
      case 'carModel':
        if (!value.trim()) return 'Car model is required';
        break;
      case 'carYear':
        if (!value.trim()) return 'Year is required';
        if (!/^\d{4}$/.test(value)) return 'Enter a valid 4-digit year';
        break;
      case 'serviceTier':
        if (!value) return 'Please select a service';
        break;
      case 'preferredDate':
        if (!value) return 'Preferred date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Date must be in the future';
        break;
      case 'preferredTime':
        if (!value) return 'Preferred time is required';
        break;
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof BookingData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<BookingData> = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof BookingData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, replace with actual API call:
      // const response = await fetch('/api/booking', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        carModel: '',
        carYear: '',
        serviceTier: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set min date to today
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="relative py-24 md:py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Info Panel */}
          <div className="lg:sticky lg:top-24">
            <span className="inline-block px-4 py-1.5 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs tracking-widest uppercase rounded-full mb-6">
              Book Appointment
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight mb-6">
              Reserve Your<br />
              <span className="text-emerald-400">Detailing Session</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              Select your service, choose a time, and we'll handle the rest.
              Confirmation within 2 hours during business hours.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                { icon: 'clock', text: 'Flexible scheduling 7 days a week' },
                { icon: 'check', text: 'Free pickup & delivery within 15mi' },
                { icon: 'shield', text: 'Satisfaction guaranteed or re-do free' },
                { icon: 'credit-card', text: 'No deposit required' },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 text-white/70">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                    {getBenefitIcon(benefit.icon)}
                  </div>
                  <span className="text-base">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Panel */}
          <div className="bg-white/3 border border-white/10 rounded-2xl p-8 md:p-10">
            {submitStatus === 'success' ? (
              <SuccessMessage onReset={() => setSubmitStatus('idle')} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Service Selection */}
                <div>
                  <label htmlFor="serviceTier" className="block text-white/70 text-sm font-medium mb-3">
                    Service Package <span className="text-emerald-400">*</span>
                  </label>
                  <select
                    id="serviceTier"
                    name="serviceTier"
                    value={formData.serviceTier}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                      errors.serviceTier ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <option value="">Select a service package</option>
                    {SERVICE_TIERS.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                  {errors.serviceTier && (
                    <p className="mt-1.5 text-sm text-emerald-400">{errors.serviceTier}</p>
                  )}
                </div>

                {/* Personal Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-white/70 text-sm font-medium mb-3">
                      Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                        errors.name ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="John Smith"
                    />
                    {errors.name && <p className="mt-1.5 text-sm text-emerald-400">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white/70 text-sm font-medium mb-3">
                      Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                        errors.email ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="john@email.com"
                    />
                    {errors.email && <p className="mt-1.5 text-sm text-emerald-400">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-white/70 text-sm font-medium mb-3">
                      Phone <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                        errors.phone ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="mt-1.5 text-sm text-emerald-400">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-white/70 text-sm font-medium mb-3">
                      Preferred Time <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                        errors.preferredTime ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <option value="">Select time</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                    {errors.preferredTime && <p className="mt-1.5 text-sm text-emerald-400">{errors.preferredTime}</p>}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <label htmlFor="carModel" className="block text-white/70 text-sm font-medium mb-3">
                      Vehicle Model <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                        errors.carModel ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="e.g., Porsche 911, Tesla Model S"
                    />
                    {errors.carModel && <p className="mt-1.5 text-sm text-emerald-400">{errors.carModel}</p>}
                  </div>

                  <div>
                    <label htmlFor="carYear" className="block text-white/70 text-sm font-medium mb-3">
                      Year <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="carYear"
                      name="carYear"
                      value={formData.carYear}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={4}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                        errors.carYear ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="2024"
                    />
                    {errors.carYear && <p className="mt-1.5 text-sm text-emerald-400">{errors.carYear}</p>}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="preferredDate" className="block text-white/70 text-sm font-medium mb-3">
                    Preferred Date <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={minDate}
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all ${
                      errors.preferredDate ? 'border-emerald-400' : 'border-white/10 hover:border-white/20'
                    }`}
                  />
                  {errors.preferredDate && <p className="mt-1.5 text-sm text-emerald-400">{errors.preferredDate}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-white/70 text-sm font-medium mb-3">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all hover:border-white/20 resize-none"
                    placeholder="Special requests, specific concerns, access instructions..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-400 text-black font-medium tracking-wide rounded-full hover:bg-emerald-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Request Appointment'
                  )}
                </button>

                {submitStatus === 'error' && (
                  <p className="text-center text-emerald-400 text-sm">
                    Something went wrong. Please try again or call us directly.
                  </p>
                )}

                <p className="text-center text-white/30 text-xs">
                  By submitting, you agree to our <a href="#" className="text-emerald-400 hover:underline">Terms</a> &{' '}
                  <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const SuccessMessage = ({ onReset }: { onReset: () => void }) => (
  <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-2xl p-10 md:p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-6 bg-emerald-400/20 rounded-full flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <h3 className="text-2xl md:text-3xl font-light text-white mb-3">Appointment Requested!</h3>
    <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
      We've received your request and will confirm within 2 hours during business hours.
      A calendar invite with details will be sent to your email.
    </p>
    <button
      onClick={onReset}
      className="px-8 py-3 bg-emerald-400 text-black font-medium rounded-full hover:bg-emerald-300 transition-all"
    >
      Book Another
    </button>
  </div>
);

function getBenefitIcon(name: string) {
  const icons: Record<string, React.ReactNode> = {
    clock: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    check: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    'credit-card': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  };
  return icons[name] || icons.check;
}