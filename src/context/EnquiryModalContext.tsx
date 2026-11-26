import React, { createContext, useContext, useState, useCallback } from 'react';

type CourseType = 'ANM' | 'GNM' | 'B.Sc. Nursing' | 'Other';

interface EnquiryModalContextType {
  isOpen: boolean;
  preselectedCourse: CourseType;
  openEnquiryModal: (course?: CourseType) => void;
  closeEnquiryModal: () => void;
}

const EnquiryModalContext = createContext<EnquiryModalContextType | undefined>(undefined);

export const EnquiryModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedCourse, setPreselectedCourse] = useState<CourseType>('ANM');

  const openEnquiryModal = useCallback((course?: CourseType) => {
    if (course) {
      setPreselectedCourse(course);
    }
    setIsOpen(true);
  }, []);

  const closeEnquiryModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <EnquiryModalContext.Provider
      value={{
        isOpen,
        preselectedCourse,
        openEnquiryModal,
        closeEnquiryModal,
      }}
    >
      {children}
    </EnquiryModalContext.Provider>
  );
};

export const useEnquiryModal = (): EnquiryModalContextType => {
  const context = useContext(EnquiryModalContext);
  if (!context) {
    throw new Error('useEnquiryModal must be used within an EnquiryModalProvider');
  }
  return context;
};
