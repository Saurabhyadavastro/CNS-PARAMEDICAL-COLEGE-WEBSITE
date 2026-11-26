import React, { useState, useId } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Eye, 
  BookOpen, 
  FlaskConical, 
  Monitor, 
  Layers, 
  Info,
  Calendar
} from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';
import { SEO } from '../components/common/SEO';
import { 
  galleryImages, 
  galleryTabs, 
  GalleryCategory, 
  GalleryImage 
} from '../content/gallery';
import { Lightbox } from '../components/common/Lightbox';

type TabSelection = 'all' | GalleryCategory;

export const Gallery: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawParam = searchParams.get('tab') as TabSelection | null;
  const initialTab: TabSelection = 
    rawParam && (['all', 'library', 'laboratory', 'classrooms', 'events'] as const).includes(rawParam as any)
      ? rawParam
      : 'all';

  const [activeTab, setActiveTab] = useState<TabSelection>(initialTab);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const tablistId = useId();

  const handleTabChange = (tab: TabSelection) => {
    setActiveTab(tab);
    setSearchParams(tab === 'all' ? {} : { tab });
  };

  const filteredImages: GalleryImage[] = activeTab === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeTab);

  const activeTabConfig = galleryTabs.find((t) => t.id === activeTab);

  const getCategoryIcon = (category: TabSelection) => {
    switch (category) {
      case 'library':
        return <BookOpen className="w-4 h-4" aria-hidden="true" />;
      case 'laboratory':
        return <FlaskConical className="w-4 h-4" aria-hidden="true" />;
      case 'classrooms':
        return <Monitor className="w-4 h-4" aria-hidden="true" />;
      case 'events':
        return <Calendar className="w-4 h-4" aria-hidden="true" />;
      default:
        return <Layers className="w-4 h-4" aria-hidden="true" />;
    }
  };

  // Keyboard navigation across tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number, allTabs: TabSelection[]) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (index + 1) % allTabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (index - 1 + allTabs.length) % allTabs.length;
    }

    if (nextIndex !== index) {
      handleTabChange(allTabs[nextIndex]);
      const nextTabEl = document.getElementById(`${tablistId}-tab-${allTabs[nextIndex]}`);
      nextTabEl?.focus();
    }
  };

  const allTabOptions: TabSelection[] = ['all', 'library', 'laboratory', 'classrooms', 'events'];

  return (
    <div className="flex flex-col">
      <SEO
        title="Campus Infrastructure & Photo Gallery"
        description="Explore C.N.S. Paramedical and Nursing College campus facilities: Medical Library, Clinical Skill Laboratories, Smart Classrooms, and Multipurpose Hall Events."
      />

      {/* Page Header */}
      <div className="bg-navy-dark text-white py-12 md:py-16 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="accent" size="sm" className="mb-3">
              Campus Facilities & Infrastructure
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Campus Photo Gallery
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Take a visual tour of our purpose-built campus along Gursahaiganj Road, Samdhan, Kannauj. Explore dedicated clinical simulation labs, reference libraries, modern lecture halls, and student events.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Section */}
      <Section
        id="gallery-tabs-section"
        badge="Visual Tour"
        title="Explore Academic & Clinical Spaces"
        subtitle="Select a facility category to inspect learning setups, training models, and multipurpose event halls."
        bgVariant="surface-light"
      >
        {/* Tab Navigation Controls (Accessible Tablist) */}
        <div className="mb-8">
          <div
            role="tablist"
            aria-label="Gallery facility categories"
            className="flex flex-wrap gap-2 sm:gap-3 p-1.5 bg-surface border border-border-subtle rounded-xl shadow-xs"
          >
            {/* "All" Tab Option */}
            <button
              id={`${tablistId}-tab-all`}
              role="tab"
              type="button"
              aria-selected={activeTab === 'all'}
              aria-controls={`${tablistId}-panel-all`}
              tabIndex={activeTab === 'all' ? 0 : -1}
              onClick={() => handleTabChange('all')}
              onKeyDown={(e) => handleTabKeyDown(e, 0, allTabOptions)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all focus-ring ${
                activeTab === 'all'
                  ? 'bg-brand text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink hover:bg-brand-faint/50'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>All Facilities</span>
              <span
                className={`text-2xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-ink-muted'
                }`}
              >
                {galleryImages.length}
              </span>
            </button>

            {/* 4 Required Primary Tabs */}
            {galleryTabs.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              const count = galleryImages.filter((img) => img.category === tab.id).length;
              const optionIndex = idx + 1; // offset because of 'all'

              return (
                <button
                  key={tab.id}
                  id={`${tablistId}-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`${tablistId}-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, optionIndex, allTabOptions)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all focus-ring ${
                    isActive
                      ? 'bg-brand text-white shadow-xs'
                      : 'text-ink-muted hover:text-ink hover:bg-brand-faint/50'
                  }`}
                >
                  {getCategoryIcon(tab.id)}
                  <span>{tab.tabLabel}</span>
                  <span
                    className={`text-2xs px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-ink-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Information Banner */}
          <div className="mt-4 p-4 rounded-xl bg-surface border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-faint text-brand shrink-0 mt-0.5">
                {getCategoryIcon(activeTab)}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-ink">
                  {activeTab === 'all' ? 'All Campus Facilities' : activeTabConfig?.tabLabel}
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-0.5">
                  {activeTab === 'all'
                    ? 'Showing comprehensive photographic documentation across Library, Laboratory, Classrooms, and Multipurpose Hall programs.'
                    : activeTabConfig?.description}
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-ink-muted shrink-0 bg-slate-100 px-3 py-1 rounded-md">
              Showing {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </span>
          </div>
        </div>

        {/* Gallery Image Grid with Fixed Aspect Ratio to Prevent Layout Shift */}
        <div
          id={`${tablistId}-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`${tablistId}-tab-${activeTab}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="bg-surface rounded-xl overflow-hidden border border-border-subtle shadow-card hover:shadow-card-hover hover:border-brand/40 transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with Fixed 4:3 Aspect Ratio and Explicit Sizing */}
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="w-full relative aspect-[4/3] bg-navy-dark overflow-hidden focus-ring block text-left group-hover:cursor-pointer"
                aria-label={`Enlarge Photo: ${image.caption}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Badge & Quick Action */}
                <div className="absolute top-3 left-3 z-10" aria-hidden="true">
                  <Badge variant="accent" size="sm">
                    {image.categoryName}
                  </Badge>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4" aria-hidden="true">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand/90 px-3 py-1.5 rounded-md shadow-xs">
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    Enlarge Image
                  </span>
                  <span className="text-2xs font-semibold text-slate-300 bg-black/60 px-2 py-1 rounded">
                    Fixed Aspect 4:3
                  </span>
                </div>
              </button>

              {/* Card Caption Information */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-surface">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-ink group-hover:text-brand transition-colors line-clamp-1">
                    {image.caption}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed mt-1 line-clamp-2">
                    {image.alt}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-border-subtle flex items-center justify-between text-2xs text-ink-muted font-medium">
                  <span className="capitalize">{image.category} Section</span>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-dark focus-ring rounded py-0.5 px-1"
                    aria-label={`View full details of ${image.caption}`}
                  >
                    <span>View Photo</span>
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notice on Real Photography Rollout */}
        <div className="mt-12 p-4 sm:p-6 rounded-xl bg-brand-faint/60 border border-brand/20 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-brand text-white shrink-0 mt-0.5">
            <Info className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-navy-dark">
              Photographic Documentation Updates
            </h4>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-1">
              The visuals shown above represent high-fidelity digital representations of our designated laboratories, medical library, classrooms, and Multipurpose Hall programs. As live academic batches and hospital training rotations advance, real clinical photography from campus events and hospital affiliations will be continually added.
            </p>
          </div>
        </div>
      </Section>

      {/* Accessible Keyboard & Swipe Lightbox */}
      <Lightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />
    </div>
  );
};
