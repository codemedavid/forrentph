import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Users, Award, Heart, CheckCircle, Clock, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { 
  AboutHero, 
  AboutStory, 
  AboutStats, 
  AboutValues, 
  WhyChooseUs, 
  AboutCTA 
} from '@/types';

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Users,
  Star,
  Award,
  Heart,
  CheckCircle,
  Clock,
};

// Fetch settings from API
async function fetchSetting(key: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/settings/${key}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      return data.setting?.value;
    }
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
  }
  return null;
}

// Default fallback data
const defaultHero: AboutHero = {
  title: 'About CostumeRental',
  subtitle: 'Making every event memorable with high-quality costume rentals since 2015.'
};

const defaultStory: AboutStory = {
  title: 'Our Story',
  paragraphs: [
    'CostumeRental was founded in 2015 with a simple mission: to make every event unforgettable through amazing costumes. What started as a small local business has grown into the region\'s premier costume rental service.',
    'We believe that the right costume can transform any event from ordinary to extraordinary. Whether it\'s a birthday party, corporate event, Halloween celebration, or themed gathering, we have the perfect costume to make your event stand out.',
    'Our team is passionate about costumes and committed to providing exceptional service. We carefully curate our collection to ensure every costume meets our high standards for quality, authenticity, and fun factor.'
  ],
  statsTitle: 'Over 500+ Costumes',
  statsSubtitle: 'From inflatable fun to character classics'
};

const defaultStats: AboutStats = {
  stats: [
    { icon: 'Users', value: '10,000+', label: 'Happy Customers' },
    { icon: 'Star', value: '4.9', label: 'Average Rating' },
    { icon: 'Award', value: '500+', label: 'Costumes Available' },
    { icon: 'Heart', value: '9', label: 'Years of Service' }
  ]
};

const defaultValues: AboutValues = {
  title: 'Our Values',
  subtitle: 'The principles that guide everything we do',
  values: [
    {
      icon: 'CheckCircle',
      iconColor: 'green',
      title: 'Quality First',
      description: 'Every costume in our collection is carefully selected and maintained to ensure the highest quality and authenticity.'
    },
    {
      icon: 'Users',
      iconColor: 'blue',
      title: 'Customer Service',
      description: 'Our friendly and knowledgeable team is here to help you find the perfect costume and ensure your event is a success.'
    },
    {
      icon: 'Heart',
      iconColor: 'purple',
      title: 'Fun & Creativity',
      description: 'We believe in the power of costumes to bring joy and creativity to any event, making memories that last a lifetime.'
    }
  ]
};

const defaultWhyChooseUs: WhyChooseUs = {
  title: 'Why Choose Us?',
  subtitle: 'Here\'s what sets us apart from the competition',
  features: [
    {
      title: 'Extensive Collection',
      description: 'Over 500 costumes across 6 categories, from inflatable fun to character classics.'
    },
    {
      title: 'Flexible Rental Options',
      description: 'Choose from 12 hours, 1 day, 3 days, or 1 week rentals to fit your event needs.'
    },
    {
      title: 'Easy Online Booking',
      description: 'Simple booking process with real-time availability and instant confirmation.'
    },
    {
      title: 'Professional Quality',
      description: 'All costumes are professionally cleaned and maintained to ensure perfect condition.'
    },
    {
      title: 'Delivery & Pickup',
      description: 'Convenient delivery and pickup services available within a 20-mile radius.'
    },
    {
      title: 'Expert Support',
      description: 'Our costume experts are available to help you choose the perfect outfit for your event.'
    }
  ]
};

const defaultCTA: AboutCTA = {
  title: 'Ready to Make Your Event Unforgettable?',
  description: 'Browse our collection of amazing costumes and find the perfect one for your next event.',
  primaryButtonText: 'Browse Costumes',
  primaryButtonLink: '/costumes',
  secondaryButtonText: 'Contact Us',
  secondaryButtonLink: '/contact'
};

export default async function AboutPage() {
  // Fetch all settings
  const [heroData, storyData, statsData, valuesData, whyChooseUsData, ctaData] = await Promise.all([
    fetchSetting('about_hero'),
    fetchSetting('about_story'),
    fetchSetting('about_stats'),
    fetchSetting('about_values'),
    fetchSetting('why_choose_us'),
    fetchSetting('about_cta')
  ]);

  const hero: AboutHero = heroData || defaultHero;
  const story: AboutStory = storyData || defaultStory;
  const stats: AboutStats = statsData || defaultStats;
  const values: AboutValues = valuesData || defaultValues;
  const whyChooseUs: WhyChooseUs = whyChooseUsData || defaultWhyChooseUs;
  const cta: AboutCTA = ctaData || defaultCTA;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {hero.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{story.title}</h2>
              <div className="space-y-4 text-gray-600">
                {story.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-8 text-center">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{story.statsTitle}</h3>
              <p className="text-gray-600">{story.statsSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Users;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{values.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {values.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.values.map((value, index) => {
              const IconComponent = iconMap[value.icon] || CheckCircle;
              const colorMap: { [key: string]: string } = {
                green: 'bg-green-100 text-green-600',
                blue: 'bg-blue-100 text-blue-600',
                purple: 'bg-purple-100 text-purple-600',
                red: 'bg-red-100 text-red-600',
                yellow: 'bg-yellow-100 text-yellow-600',
                orange: 'bg-orange-100 text-orange-600'
              };
              const colorClass = colorMap[value.iconColor] || 'bg-primary/10 text-primary';
              const bgColor = colorClass.split(' ')[0];
              const textColor = colorClass.split(' ')[1];
              
              return (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`h-8 w-8 ${textColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{whyChooseUs.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {whyChooseUs.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {cta.title}
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                {cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href={cta.primaryButtonLink}>{cta.primaryButtonText}</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href={cta.secondaryButtonLink}>{cta.secondaryButtonText}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
