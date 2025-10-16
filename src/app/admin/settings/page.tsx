'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Save, RefreshCw, Info, Plus, Trash2 } from 'lucide-react';
import { 
  AboutHero, 
  AboutStory, 
  AboutStats, 
  AboutValues, 
  WhyChooseUs, 
  AboutCTA,
  HeaderBranding
} from '@/types';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'header-branding' | 'about-hero' | 'about-story' | 'about-stats' | 'about-values' | 'why-choose-us' | 'home-why-choose-us' | 'about-cta'>('header-branding');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State for different sections
  const [headerBranding, setHeaderBranding] = useState<HeaderBranding>({ companyName: '', companyFullName: '', tagline: '', logoEmoji: '' });
  const [aboutHero, setAboutHero] = useState<AboutHero>({ title: '', subtitle: '' });
  const [aboutStory, setAboutStory] = useState<AboutStory>({ title: '', paragraphs: [], statsTitle: '', statsSubtitle: '' });
  const [aboutStats, setAboutStats] = useState<AboutStats>({ stats: [] });
  const [aboutValues, setAboutValues] = useState<AboutValues>({ title: '', subtitle: '', values: [] });
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUs>({ title: '', subtitle: '', features: [] });
  const [homeWhyChooseUs, setHomeWhyChooseUs] = useState<WhyChooseUs>({ title: '', subtitle: '', features: [] });
  const [aboutCta, setAboutCta] = useState<AboutCTA>({ title: '', description: '', primaryButtonText: '', primaryButtonLink: '', secondaryButtonText: '', secondaryButtonLink: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings || [];
        
        settings.forEach((setting: { key: string; value: Record<string, unknown> }) => {
          switch (setting.key) {
            case 'header_branding':
              setHeaderBranding(setting.value as unknown as HeaderBranding);
              break;
            case 'about_hero':
              setAboutHero(setting.value as unknown as AboutHero);
              break;
            case 'about_story':
              setAboutStory(setting.value as unknown as AboutStory);
              break;
            case 'about_stats':
              setAboutStats(setting.value as unknown as AboutStats);
              break;
            case 'about_values':
              setAboutValues(setting.value as unknown as AboutValues);
              break;
            case 'why_choose_us':
              setWhyChooseUs(setting.value as unknown as WhyChooseUs);
              break;
            case 'home_why_choose_us':
              setHomeWhyChooseUs(setting.value as unknown as WhyChooseUs);
              break;
            case 'about_cta':
              setAboutCta(setting.value as unknown as AboutCTA);
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: unknown) {
    try {
      setSaving(true);
      const response = await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const handleSave = () => {
    switch (activeTab) {
      case 'header-branding':
        saveSetting('header_branding', headerBranding);
        break;
      case 'about-hero':
        saveSetting('about_hero', aboutHero);
        break;
      case 'about-story':
        saveSetting('about_story', aboutStory);
        break;
      case 'about-stats':
        saveSetting('about_stats', aboutStats);
        break;
      case 'about-values':
        saveSetting('about_values', aboutValues);
        break;
      case 'why-choose-us':
        saveSetting('why_choose_us', whyChooseUs);
        break;
      case 'home-why-choose-us':
        saveSetting('home_why_choose_us', homeWhyChooseUs);
        break;
      case 'about-cta':
        saveSetting('about_cta', aboutCta);
        break;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-gray-600 mt-1">Manage your website content</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={fetchSettings} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Content Management</p>
                <p className="text-sm text-blue-700 mt-1">
                  Edit the content for your About Us page and other sections. Changes will be reflected immediately after saving.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-4 overflow-x-auto">
            {[
              { id: 'header-branding', label: '🎯 Header Branding' },
              { id: 'about-hero', label: 'About Hero' },
              { id: 'about-story', label: 'Our Story' },
              { id: 'about-stats', label: 'Statistics' },
              { id: 'about-values', label: 'Our Values' },
              { id: 'why-choose-us', label: 'Why Choose Us (About)' },
              { id: 'home-why-choose-us', label: 'Why Choose Us (Home)' },
              { id: 'about-cta', label: 'Call to Action' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Header Branding Tab */}
        {activeTab === 'header-branding' && (
          <Card>
            <CardHeader>
              <CardTitle>Header Branding</CardTitle>
              <CardDescription>
                Customize your website header - company name, tagline, and logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name (Short)</Label>
                <Input
                  id="company-name"
                  value={headerBranding.companyName}
                  onChange={(e) => setHeaderBranding({ ...headerBranding, companyName: e.target.value })}
                  placeholder="ForRentPH"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This appears in the header. Keep it short (1-3 words).
                </p>
              </div>
              <div>
                <Label htmlFor="company-full-name">Company Full Name</Label>
                <Input
                  id="company-full-name"
                  value={headerBranding.companyFullName}
                  onChange={(e) => setHeaderBranding({ ...headerBranding, companyFullName: e.target.value })}
                  placeholder="ForRentPH - Inflatable Costumes Rentals"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Full business name for SEO and metadata.
                </p>
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={headerBranding.tagline}
                  onChange={(e) => setHeaderBranding({ ...headerBranding, tagline: e.target.value })}
                  placeholder="Where fun comes alive"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A short catchphrase that appears below your company name.
                </p>
              </div>
              <div>
                <Label htmlFor="logo-emoji">Logo Emoji</Label>
                <Input
                  id="logo-emoji"
                  value={headerBranding.logoEmoji}
                  onChange={(e) => setHeaderBranding({ ...headerBranding, logoEmoji: e.target.value })}
                  placeholder="🎭"
                  maxLength={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Choose an emoji for your logo (e.g., 🎭, 🎉, 🎪, 🎨)
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-xl">
                      {headerBranding.logoEmoji || '🎭'}
                    </span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">
                      {headerBranding.companyName || 'ForRentPH'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {headerBranding.tagline || 'Where fun comes alive'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Hero Tab */}
        {activeTab === 'about-hero' && (
          <Card>
            <CardHeader>
              <CardTitle>About Page Hero Section</CardTitle>
              <CardDescription>Main title and subtitle for the About page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={aboutHero.title}
                  onChange={(e) => setAboutHero({ ...aboutHero, title: e.target.value })}
                  placeholder="About CostumeRental"
                />
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={aboutHero.subtitle}
                  onChange={(e) => setAboutHero({ ...aboutHero, subtitle: e.target.value })}
                  placeholder="Making every event memorable..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Story Tab */}
        {activeTab === 'about-story' && (
          <Card>
            <CardHeader>
              <CardTitle>Our Story Section</CardTitle>
              <CardDescription>Tell your company&apos;s story</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="story-title">Section Title</Label>
                <Input
                  id="story-title"
                  value={aboutStory.title}
                  onChange={(e) => setAboutStory({ ...aboutStory, title: e.target.value })}
                  placeholder="Our Story"
                />
              </div>
              
              <div>
                <Label>Story Paragraphs</Label>
                {aboutStory.paragraphs.map((paragraph, index) => (
                  <div key={index} className="mt-2 flex space-x-2">
                    <Textarea
                      value={paragraph}
                      onChange={(e) => {
                        const newParagraphs = [...aboutStory.paragraphs];
                        newParagraphs[index] = e.target.value;
                        setAboutStory({ ...aboutStory, paragraphs: newParagraphs });
                      }}
                      placeholder={`Paragraph ${index + 1}`}
                      rows={3}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newParagraphs = aboutStory.paragraphs.filter((_, i) => i !== index);
                        setAboutStory({ ...aboutStory, paragraphs: newParagraphs });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAboutStory({ ...aboutStory, paragraphs: [...aboutStory.paragraphs, ''] })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Paragraph
                </Button>
              </div>

              <div>
                <Label htmlFor="stats-title">Stats Title</Label>
                <Input
                  id="stats-title"
                  value={aboutStory.statsTitle}
                  onChange={(e) => setAboutStory({ ...aboutStory, statsTitle: e.target.value })}
                  placeholder="Over 500+ Costumes"
                />
              </div>

              <div>
                <Label htmlFor="stats-subtitle">Stats Subtitle</Label>
                <Input
                  id="stats-subtitle"
                  value={aboutStory.statsSubtitle}
                  onChange={(e) => setAboutStory({ ...aboutStory, statsSubtitle: e.target.value })}
                  placeholder="From inflatable fun to character classics"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Stats Tab */}
        {activeTab === 'about-stats' && (
          <Card>
            <CardHeader>
              <CardTitle>Statistics Section</CardTitle>
              <CardDescription>Display key business metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutStats.stats.map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">Stat {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newStats = aboutStats.stats.filter((_, i) => i !== index);
                        setAboutStats({ stats: newStats });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label>Icon (lucide-react name)</Label>
                      <Input
                        value={stat.icon}
                        onChange={(e) => {
                          const newStats = [...aboutStats.stats];
                          newStats[index] = { ...stat, icon: e.target.value };
                          setAboutStats({ stats: newStats });
                        }}
                        placeholder="Users, Star, Award, Heart"
                      />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...aboutStats.stats];
                          newStats[index] = { ...stat, value: e.target.value };
                          setAboutStats({ stats: newStats });
                        }}
                        placeholder="10,000+"
                      />
                    </div>
                    <div>
                      <Label>Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...aboutStats.stats];
                          newStats[index] = { ...stat, label: e.target.value };
                          setAboutStats({ stats: newStats });
                        }}
                        placeholder="Happy Customers"
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => setAboutStats({ stats: [...aboutStats.stats, { icon: '', value: '', label: '' }] })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </Button>
            </CardContent>
          </Card>
        )}

        {/* About Values Tab */}
        {activeTab === 'about-values' && (
          <Card>
            <CardHeader>
              <CardTitle>Our Values Section</CardTitle>
              <CardDescription>Company values and principles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="values-title">Section Title</Label>
                <Input
                  id="values-title"
                  value={aboutValues.title}
                  onChange={(e) => setAboutValues({ ...aboutValues, title: e.target.value })}
                  placeholder="Our Values"
                />
              </div>
              <div>
                <Label htmlFor="values-subtitle">Section Subtitle</Label>
                <Input
                  id="values-subtitle"
                  value={aboutValues.subtitle}
                  onChange={(e) => setAboutValues({ ...aboutValues, subtitle: e.target.value })}
                  placeholder="The principles that guide everything we do"
                />
              </div>
              
              <div>
                <Label className="mb-2">Values</Label>
                {aboutValues.values.map((value, index) => (
                  <Card key={index} className="p-4 mb-3">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium">Value {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newValues = aboutValues.values.filter((_, i) => i !== index);
                          setAboutValues({ ...aboutValues, values: newValues });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Icon (lucide-react name)</Label>
                        <Input
                          value={value.icon}
                          onChange={(e) => {
                            const newValues = [...aboutValues.values];
                            newValues[index] = { ...value, icon: e.target.value };
                            setAboutValues({ ...aboutValues, values: newValues });
                          }}
                          placeholder="CheckCircle, Users, Heart"
                        />
                      </div>
                      <div>
                        <Label>Icon Color</Label>
                        <Input
                          value={value.iconColor}
                          onChange={(e) => {
                            const newValues = [...aboutValues.values];
                            newValues[index] = { ...value, iconColor: e.target.value };
                            setAboutValues({ ...aboutValues, values: newValues });
                          }}
                          placeholder="green, blue, purple"
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => {
                            const newValues = [...aboutValues.values];
                            newValues[index] = { ...value, title: e.target.value };
                            setAboutValues({ ...aboutValues, values: newValues });
                          }}
                          placeholder="Quality First"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={value.description}
                          onChange={(e) => {
                            const newValues = [...aboutValues.values];
                            newValues[index] = { ...value, description: e.target.value };
                            setAboutValues({ ...aboutValues, values: newValues });
                          }}
                          placeholder="Description of this value"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setAboutValues({ 
                    ...aboutValues, 
                    values: [...aboutValues.values, { icon: '', iconColor: '', title: '', description: '' }] 
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Why Choose Us (About Page) Tab */}
        {activeTab === 'why-choose-us' && (
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us (About Page)</CardTitle>
              <CardDescription>Features and benefits for the About page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wcu-title">Section Title</Label>
                <Input
                  id="wcu-title"
                  value={whyChooseUs.title}
                  onChange={(e) => setWhyChooseUs({ ...whyChooseUs, title: e.target.value })}
                  placeholder="Why Choose Us?"
                />
              </div>
              <div>
                <Label htmlFor="wcu-subtitle">Section Subtitle</Label>
                <Input
                  id="wcu-subtitle"
                  value={whyChooseUs.subtitle}
                  onChange={(e) => setWhyChooseUs({ ...whyChooseUs, subtitle: e.target.value })}
                  placeholder="Here's what sets us apart"
                />
              </div>
              
              <div>
                <Label className="mb-2">Features</Label>
                {whyChooseUs.features.map((feature, index) => (
                  <Card key={index} className="p-4 mb-3">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium">Feature {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFeatures = whyChooseUs.features.filter((_, i) => i !== index);
                          setWhyChooseUs({ ...whyChooseUs, features: newFeatures });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...whyChooseUs.features];
                            newFeatures[index] = { ...feature, title: e.target.value };
                            setWhyChooseUs({ ...whyChooseUs, features: newFeatures });
                          }}
                          placeholder="Extensive Collection"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...whyChooseUs.features];
                            newFeatures[index] = { ...feature, description: e.target.value };
                            setWhyChooseUs({ ...whyChooseUs, features: newFeatures });
                          }}
                          placeholder="Description of this feature"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setWhyChooseUs({ 
                    ...whyChooseUs, 
                    features: [...whyChooseUs.features, { title: '', description: '' }] 
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Why Choose Us (Home Page) Tab */}
        {activeTab === 'home-why-choose-us' && (
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us (Home Page)</CardTitle>
              <CardDescription>Features and benefits for the Home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="home-wcu-title">Section Title</Label>
                <Input
                  id="home-wcu-title"
                  value={homeWhyChooseUs.title}
                  onChange={(e) => setHomeWhyChooseUs({ ...homeWhyChooseUs, title: e.target.value })}
                  placeholder="Why Choose Us?"
                />
              </div>
              <div>
                <Label htmlFor="home-wcu-subtitle">Section Subtitle</Label>
                <Input
                  id="home-wcu-subtitle"
                  value={homeWhyChooseUs.subtitle}
                  onChange={(e) => setHomeWhyChooseUs({ ...homeWhyChooseUs, subtitle: e.target.value })}
                  placeholder="We make costume rental easy..."
                />
              </div>
              
              <div>
                <Label className="mb-2">Features</Label>
                {homeWhyChooseUs.features.map((feature, index) => (
                  <Card key={index} className="p-4 mb-3">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium">Feature {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFeatures = homeWhyChooseUs.features.filter((_, i) => i !== index);
                          setHomeWhyChooseUs({ ...homeWhyChooseUs, features: newFeatures });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label>Icon (lucide-react name)</Label>
                        <Input
                          value={feature.icon || ''}
                          onChange={(e) => {
                            const newFeatures = [...homeWhyChooseUs.features];
                            newFeatures[index] = { ...feature, icon: e.target.value };
                            setHomeWhyChooseUs({ ...homeWhyChooseUs, features: newFeatures });
                          }}
                          placeholder="Clock, Users, Star"
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...homeWhyChooseUs.features];
                            newFeatures[index] = { ...feature, title: e.target.value };
                            setHomeWhyChooseUs({ ...homeWhyChooseUs, features: newFeatures });
                          }}
                          placeholder="Flexible Rental Periods"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...homeWhyChooseUs.features];
                            newFeatures[index] = { ...feature, description: e.target.value };
                            setHomeWhyChooseUs({ ...homeWhyChooseUs, features: newFeatures });
                          }}
                          placeholder="Description of this feature"
                          rows={3}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setHomeWhyChooseUs({ 
                    ...homeWhyChooseUs, 
                    features: [...homeWhyChooseUs.features, { icon: '', title: '', description: '' }] 
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About CTA Tab */}
        {activeTab === 'about-cta' && (
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Section</CardTitle>
              <CardDescription>Bottom CTA on the About page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cta-title">Title</Label>
                <Input
                  id="cta-title"
                  value={aboutCta.title}
                  onChange={(e) => setAboutCta({ ...aboutCta, title: e.target.value })}
                  placeholder="Ready to Make Your Event Unforgettable?"
                />
              </div>
              <div>
                <Label htmlFor="cta-description">Description</Label>
                <Textarea
                  id="cta-description"
                  value={aboutCta.description}
                  onChange={(e) => setAboutCta({ ...aboutCta, description: e.target.value })}
                  placeholder="Browse our collection..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-btn-text">Primary Button Text</Label>
                  <Input
                    id="primary-btn-text"
                    value={aboutCta.primaryButtonText}
                    onChange={(e) => setAboutCta({ ...aboutCta, primaryButtonText: e.target.value })}
                    placeholder="Browse Costumes"
                  />
                </div>
                <div>
                  <Label htmlFor="primary-btn-link">Primary Button Link</Label>
                  <Input
                    id="primary-btn-link"
                    value={aboutCta.primaryButtonLink}
                    onChange={(e) => setAboutCta({ ...aboutCta, primaryButtonLink: e.target.value })}
                    placeholder="/costumes"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="secondary-btn-text">Secondary Button Text</Label>
                  <Input
                    id="secondary-btn-text"
                    value={aboutCta.secondaryButtonText}
                    onChange={(e) => setAboutCta({ ...aboutCta, secondaryButtonText: e.target.value })}
                    placeholder="Contact Us"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-btn-link">Secondary Button Link</Label>
                  <Input
                    id="secondary-btn-link"
                    value={aboutCta.secondaryButtonLink}
                    onChange={(e) => setAboutCta({ ...aboutCta, secondaryButtonLink: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button at Bottom */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

