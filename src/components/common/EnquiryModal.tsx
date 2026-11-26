import React from 'react';
import { useEnquiryModal } from '../../context/EnquiryModalContext';
import { Modal } from '../ui/Modal';
import { EnquiryForm } from './EnquiryForm';

export const EnquiryModal: React.FC = () => {
  const { isOpen, preselectedCourse, closeEnquiryModal } = useEnquiryModal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeEnquiryModal}
      title="Admission Enquiry Form (2026–27)"
      description="Submit your academic background. Our counselors in Samdhan, Kannauj will review your details and contact you."
      size="lg"
    >
      <div className="py-2">
        <EnquiryForm
          preselectedCourse={preselectedCourse}
          isModalView={true}
          onSuccess={() => {
            // Give user a brief moment to see success toast, then modal can close or stay open for feedback
          }}
        />
      </div>
    </Modal>
  );
};
