'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Package } from 'lucide-react';
import { AvailabilityCalendar } from '@/components/admin/availability-calendar';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Costume } from '@/types';

export default function CostumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const costumeId = params.id as string;
  
  const [costume, setCostume] = useState<Costume | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCostume();
  }, [costumeId]);

  const fetchCostume = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/costumes/${costumeId}`);
      if (response.ok) {
        const data = await response.json();
        setCostume(data.costume);
      }
    } catch (error) {
      console.error('Error fetching costume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading costume details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!costume) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Costume Not Found</h1>
            <Button onClick={() => router.push('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {costume.name}
              </h1>
              <p className="text-gray-600">{costume.description}</p>
            </div>
            <Button onClick={() => router.push(`/admin`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Costume
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Costume Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Costume Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Images */}
                {costume.images && costume.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {costume.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={image}
                          alt={`${costume.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Info */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Size:</span>
                    <Badge variant="secondary" className="font-bold">{costume.size}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Difficulty:</span>
                    <Badge variant="secondary" className="font-bold">{costume.difficulty}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Setup Time:</span>
                    <span className="text-sm font-bold">{costume.setupTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <Badge className={costume.isAvailable ? 'bg-green-100 text-green-800 font-bold' : 'bg-red-100 text-red-800 font-bold'}>
                      {costume.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-gray-900">Pricing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">12 Hours:</span>
                      <span className="font-medium">₱{costume.pricePer12Hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Daily Rate:</span>
                      <span className="font-medium">₱{costume.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weekly Rate:</span>
                      <span className="font-medium">₱{costume.pricePerWeek}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {costume.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Availability Calendar */}
          <div className="lg:col-span-2">
            <AvailabilityCalendar
              costumeId={costume.id}
              costumeName={costume.name}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

