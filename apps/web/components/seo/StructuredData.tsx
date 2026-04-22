import Script from 'next/script';

export type OrganizationSchema = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
};

export type CourseSchema = {
  '@context': 'https://schema.org';
  '@type': 'Course';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
    sameAs: string;
  };
  url: string;
  image?: string;
  courseCode?: string;
};

export type WebPageSchema = {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
};

export type ReviewSchema = {
  '@context': 'https://schema.org';
  '@type': 'Review';
  author: {
    '@type': 'Person';
    name: string;
  };
  reviewBody: string;
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number;
    bestRating: number;
  };
  itemReviewed?: {
    '@type': 'Organization';
    name: string;
  };
  datePublished?: string;
};

export type SchemaData = OrganizationSchema | CourseSchema | WebPageSchema | ReviewSchema;

type StructuredDataProps = {
  data: SchemaData | SchemaData[] | null | undefined;
};

export function StructuredData({ data }: StructuredDataProps) {
  // Guard against undefined or null data
  if (!data) {
    return null;
  }

  // Handle array case - filter out invalid items
  if (Array.isArray(data)) {
    const validData = data.filter(
      (item): item is SchemaData =>
        item !== null &&
        typeof item === 'object' &&
        '@context' in item &&
        typeof item['@context'] === 'string'
    );
    if (validData.length === 0) {
      return null;
    }
    const jsonLd = JSON.stringify(validData, null, 2);
    return (
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
        id="structured-data"
      />
    );
  }

  // Handle single object case
  if (
    typeof data !== 'object' ||
    !('@context' in data) ||
    typeof data['@context'] !== 'string'
  ) {
    return null;
  }

  const jsonLd = JSON.stringify(data, null, 2);

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
      id="structured-data"
    />
  );
}

// Helper to create organization schema
export function createOrganizationSchema(baseUrl: string): OrganizationSchema | null {
  if (!baseUrl) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RealWorkStudio',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Real developer training with real projects. Build a portfolio employers trust.',
    sameAs: [
      'https://github.com/realworkstudio',
      'https://twitter.com/realworkstudio',
      'https://linkedin.com/company/realworkstudio',
    ],
  };
}

// Helper to create course schema for programs
export function createCourseSchema(
  program: {
    title: string;
    description: string;
    slug: string;
    thumbnailUrl?: string;
  } | null | undefined,
  baseUrl: string
): CourseSchema | null {
  if (!program || !program.title || !program.description || !program.slug || !baseUrl) {
    return null;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title,
    description: program.description,
    provider: {
      '@type': 'Organization',
      name: 'RealWorkStudio',
      sameAs: baseUrl,
    },
    url: `${baseUrl}/programs/${program.slug}`,
    image: program.thumbnailUrl || `${baseUrl}/og-image.png`,
  };
}

// Helper to create web page schema
export function createWebPageSchema(
  title: string,
  description: string,
  url: string
): WebPageSchema | null {
  if (!title || !description || !url) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
  };
}

// Helper to create review schema for testimonials
export function createReviewSchema(
  testimonial: {
    name: string;
    content: string;
    rating: number;
    createdAt?: string;
  } | null | undefined,
  organizationName = 'RealWorkStudio'
): ReviewSchema | null {
  if (!testimonial || !testimonial.name || !testimonial.content || typeof testimonial.rating !== 'number') {
    return null;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: testimonial.name,
    },
    reviewBody: testimonial.content,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: testimonial.rating,
      bestRating: 5,
    },
    itemReviewed: {
      '@type': 'Organization',
      name: organizationName,
    },
    datePublished: testimonial.createdAt,
  };
}
