import React from 'react';
import { ExternalLink, Music, Newspaper, Film, Box, Calendar, Trophy } from 'lucide-react';
import { Event } from '../types';

const typeIcons = {
  song: Music,
  movie: Film,
  news: Newspaper,
  other: Box,
  furbol: Trophy
};

interface EventCardProps {
  event: Event;
  currentValue: number;
}

export function EventCard({ event, currentValue }: EventCardProps) {
  const Icon = typeIcons[event.type];
  const inflationMultiplier = (currentValue / event.amount).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 border border-gray-100">
      <div className="p-6">
        <div className="flex items-center mb-1">
          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mr-2">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
        </div>
        
        <div className="flex items-center mb-4 text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{event.date}</span>
        </div>
        
        {(event.artist || event.source) && (
          <p className="text-sm text-gray-600 mb-3 italic">
            {event.artist || event.source}
          </p>
        )}
        
        <p className="text-gray-700 mb-4">{event.description}</p>
        
        <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Valor original:</span>
            <span className="font-semibold">$ {event.amount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Valor actual:</span>
            <span className="font-bold text-blue-600">$ {currentValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-2">
            <span className="text-sm text-gray-500">Multiplicador:</span>
            <span className="font-medium text-green-600">{inflationMultiplier}x</span>
          </div>
        </div>
        
        {event.link && event.link !== '' && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Ver fuente <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
      </div>
    </div>
  );
}