import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const PropertyInfo = ({ property }) => {
  if (!property) return null;

  return (
    <Card className="bg-white">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{property.name}</h2>
          
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            <p className="flex items-start">
              <svg className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{property.address}</span>
            </p>
            
            {property.location && (
              <p className="flex items-start">
                <svg className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.location}</span>
              </p>
            )}
            
            {property.propertyType && (
              <p className="flex items-start">
                <svg className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Type: {property.propertyType}</span>
              </p>
            )}
            
            {property.yearBuilt && (
              <p className="flex items-start">
                <svg className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Year Built: {property.yearBuilt}</span>
              </p>
            )}
          </div>
          
          {property.description && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Description</h3>
              <p className="mt-1 text-sm text-gray-600">{property.description}</p>
            </div>
          )}
          
          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-900">Amenities</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center rounded-full bg-[rgb(var(--color-primary))/0.1] px-3 py-0.5 text-sm font-medium text-[rgb(var(--color-primary))]"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-col space-y-2 md:mt-0 md:ml-6">
          <Link to={`/landlord/properties/${property.id}/edit`}>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Property
            </Button>
          </Link>
          
          <Link to={`/landlord/properties/${property.id}/units/new`}>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Unit
            </Button>
          </Link>
          
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(property.address)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View on Map
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
};

export default PropertyInfo;
