import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, Mail, User, GraduationCap, MapPin, Percent } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../ui/Toast';

export interface EnquiryFormProps {
  preselectedCourse?: 'ANM' | 'GNM' | 'B.Sc. Nursing' | 'Other';
  onSuccess?: () => void;
  className?: string;
  isModalView?: boolean;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  course: 'ANM' | 'GNM' | 'B.Sc. Nursing' | 'Other';
  last_qualification: string;
  percentage: string;
  city: string;
  message: string;
  honeypot: string; // Anti-spam hidden field
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  preselectedCourse = 'ANM',
  onSuccess,
  className = '',
  isModalView = false,
}) => {
  const { addToast } = useToast();

  const initialFormState: FormState = {
    name: '',
    phone: '',
    email: '',
    course: preselectedCourse,
    last_qualification: '',
    percentage: '',
    city: '',
    message: '',
    honeypot: '',
  };

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Sync preselectedCourse if it changes
  useEffect(() => {
    if (preselectedCourse) {
      setFormData((prev) => ({ ...prev, course: preselectedCourse }));
    }
  }, [preselectedCourse]);

  const courseOptions = [
    { label: 'ANM (Auxiliary Nurse Midwifery - 2 Years)', value: 'ANM' },
    { label: 'GNM (General Nursing & Midwifery - 3 Years)', value: 'GNM' },
    { label: 'B.Sc. Nursing (Undergraduate Degree - 4 Years)', value: 'B.Sc. Nursing' },
    { label: 'Other Healthcare Inquiry', value: 'Other' },
  ];

  const validateField = (field: keyof FormState, value: string): string | null => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        if (value.trim().length > 100) return 'Name must not exceed 100 characters.';
        return null;

      case 'phone': {
        const cleanPhone = value.replace(/[\s-+]/g, '');
        if (!cleanPhone) return '10-digit mobile number is required.';
        if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
          return 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).';
        }
        return null;
      }

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address (or leave empty).';
        }
        return null;

      case 'last_qualification':
        if (!value.trim()) return 'Please enter your highest academic qualification.';
        if (value.trim().length < 2) return 'Qualification is too short.';
        return null;

      case 'percentage':
        if (value) {
          const num = parseFloat(value);
          if (isNaN(num) || num < 0 || num > 100) {
            return 'Percentage must be a number between 0 and 100.';
          }
        }
        return null;

      case 'city':
        if (!value.trim()) return 'Please enter your city, town, or village name.';
        return null;

      default:
        return null;
    }
  };

  const handleBlur = (field: keyof FormState) => {
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error || '',
    }));
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameErr = validateField('name', formData.name);
    if (nameErr) newErrors.name = nameErr;

    const phoneErr = validateField('phone', formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const qualErr = validateField('last_qualification', formData.last_qualification);
    if (qualErr) newErrors.last_qualification = qualErr;

    const pctErr = validateField('percentage', formData.percentage);
    if (pctErr) newErrors.percentage = pctErr;

    const cityErr = validateField('city', formData.city);
    if (cityErr) newErrors.city = cityErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submits
    if (isSubmitting) return;

    setGeneralError(null);

    // Honeypot check: If bot filled the hidden field, silently reject
    if (formData.honeypot) {
      console.warn('Spam submission detected by honeypot.');
      setIsSuccess(true);
      setFormData(initialFormState);
      return;
    }

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = formData.phone.replace(/[\s-+]/g, '');
      const payload = {
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim() || null,
        course: formData.course,
        last_qualification: formData.last_qualification.trim(),
        percentage: formData.percentage ? parseFloat(formData.percentage) : null,
        city: formData.city.trim(),
        message: formData.message.trim() || null,
      };

      // CHANGED: insert only. Visitors can add enquiries but cannot read them back,
      // so there is no .select() and no data check here.
      const { error } = await supabase.from('enquiries').insert([payload]);

      if (error) {
        throw new Error(error.message || 'Database error occurred while submitting enquiry.');
      }

      // Success workflow
      setIsSuccess(true);
      setFormData(initialFormState); // Clear form after success
      setErrors({});

      addToast({
        type: 'success',
        title: 'Enquiry Received!',
        message: 'Thank you! Our admission counselors will get in touch shortly.',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      setGeneralError(
        err?.message || 'Unable to submit your enquiry at this moment. Please call the admission desk directly.'
      );
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Could not record enquiry. Please verify details or try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {isSuccess ? (
        <div
          role="status"
          aria-live="polite"
          className="p-8 text-center bg-status-success-soft border border-status-success/30 rounded-xl"
        >
          <div className="w-14 h-14 rounded-full bg-status-success/10 text-status-success mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">
            Enquiry Submitted Successfully!
          </h3>
          <p className="text-xs sm:text-sm text-ink-muted mb-6 max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to <strong>C.N.S. Paramedical and Nursing College</strong>. Our admissions officer will review your academic background and call you on your provided phone number.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsSuccess(false);
                setFormData(initialFormState);
              }}
            >
              Submit Another Enquiry
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
          {/* General Error Banner */}
          {generalError && (
            <div
              role="alert"
              className="p-3.5 rounded-lg bg-status-error-soft border border-status-error/30 text-status-error text-xs flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{generalError}</span>
            </div>
          )}

          {/* SPAM HONEYPOT FIELD (Hidden from real users) */}
          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
            <label htmlFor="hp_website">Leave this field blank</label>
            <input
              type="text"
              id="hp_website"
              name="hp_website"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Candidate Full Name */}
          <Input
            id="enquiry_name"
            name="name"
            label="Candidate Full Name"
            required
            placeholder="e.g. Anjali Yadav"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            error={errors.name}
            disabled={isSubmitting}
            leftIcon={<User className="w-4 h-4 text-ink-light" aria-hidden="true" />}
          />

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="enquiry_phone"
              name="phone"
              type="tel"
              label="10-Digit Mobile Number"
              required
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={errors.phone}
              disabled={isSubmitting}
              helperText="For calling & WhatsApp updates"
              leftIcon={<Phone className="w-4 h-4 text-ink-light" aria-hidden="true" />}
            />

            <Input
              id="enquiry_email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="e.g. anjali@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              disabled={isSubmitting}
              helperText="Optional"
              leftIcon={<Mail className="w-4 h-4 text-ink-light" aria-hidden="true" />}
            />
          </div>

          {/* Course Selection */}
          <Select
            id="enquiry_course"
            name="course"
            label="Course of Interest"
            required
            options={courseOptions}
            value={formData.course}
            onChange={(e) => handleChange('course', e.target.value as any)}
            disabled={isSubmitting}
            helperText="Select the nursing diploma or degree program you wish to join"
          />

          {/* Qualification, Percentage & City Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <Input
                id="enquiry_qualification"
                name="last_qualification"
                label="Last Qualification"
                required
                placeholder="e.g. 10+2 PCB"
                value={formData.last_qualification}
                onChange={(e) => handleChange('last_qualification', e.target.value)}
                onBlur={() => handleBlur('last_qualification')}
                error={errors.last_qualification}
                disabled={isSubmitting}
                leftIcon={<GraduationCap className="w-4 h-4 text-ink-light" aria-hidden="true" />}
              />
            </div>

            <div className="sm:col-span-1">
              <Input
                id="enquiry_percentage"
                name="percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                label="Percentage (%)"
                placeholder="e.g. 68.5"
                value={formData.percentage}
                onChange={(e) => handleChange('percentage', e.target.value)}
                onBlur={() => handleBlur('percentage')}
                error={errors.percentage}
                disabled={isSubmitting}
                leftIcon={<Percent className="w-4 h-4 text-ink-light" aria-hidden="true" />}
              />
            </div>

            <div className="sm:col-span-1">
              <Input
                id="enquiry_city"
                name="city"
                label="City / Village"
                required
                placeholder="e.g. Samdhan"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                error={errors.city}
                disabled={isSubmitting}
                leftIcon={<MapPin className="w-4 h-4 text-ink-light" aria-hidden="true" />}
              />
            </div>
          </div>

          {/* Message / Questions */}
          <Textarea
            id="enquiry_message"
            name="message"
            label="Additional Questions / Message"
            rows={isModalView ? 2 : 3}
            placeholder="Ask questions about hostel accommodation, bus transport routes, scholarship schemes, or hospital clinical rotations..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            disabled={isSubmitting}
            helperText="Maximum 2000 characters"
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              rightIcon={<Send className="w-4 h-4" aria-hidden="true" />}
            >
              {isSubmitting ? 'Submitting Enquiry...' : 'Submit Admission Enquiry'}
            </Button>
          </div>

          <p className="text-[11px] text-ink-light text-center">
            Your contact information will be used solely for academic counseling by C.N.S. Paramedical College.
          </p>
        </form>
      )}
    </div>
  );
};