import React, { useEffect, useState } from 'react';
import { CircleDollarSign, ArrowUpDown, Calendar, DollarSign, Twitter } from 'lucide-react';
import { EventCard } from './components/EventCard';
import { events } from './data/events';
import { fetchInflationData, calculateCurrentValue } from './utils/inflation';
import type { InflationData, Event } from './types';

type SortOption = 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc';

function App() {
  const [inflationData, setInflationData] = useState<InflationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');

  useEffect(() => {
    fetchInflationData()
      .then(data => {
        setInflationData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los datos de inflación');
        setLoading(false);
      });
  }, []);

  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => {
      if (sortOption === 'date-asc') {
        return a.date.localeCompare(b.date);
      } else if (sortOption === 'date-desc') {
        return b.date.localeCompare(a.date);
      } else if (sortOption === 'amount-asc') {
        return a.amount - b.amount;
      } else {
        return b.amount - a.amount;
      }
    });
  }, [sortOption]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Cargando datos de inflación...</p>
          <p className="mt-2 text-gray-500 text-sm">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <p className="mt-2 text-gray-500">Por favor, intentá nuevamente más tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <CircleDollarSign className="w-10 h-10" />
            <h1 className="text-5xl font-bold">devalu.ar</h1>
          </div>
          <p className="text-center mt-3 text-blue-100 max-w-2xl mx-auto">
            Explorá cómo la inflación transformó los valores a través del tiempo en Argentina
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
            Eventos históricos
          </h2>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 mr-2 hidden sm:inline">Ordenar por:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortOption(sortOption === 'date-asc' ? 'date-desc' : 'date-asc')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                  sortOption.startsWith('date') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Fecha
                <ArrowUpDown className="w-3 h-3" />
              </button>
              
              <button
                onClick={() => setSortOption(sortOption === 'amount-asc' ? 'amount-desc' : 'amount-asc')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                  sortOption.startsWith('amount') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Monto
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              currentValue={calculateCurrentValue(event.amount, event.date, inflationData)}
            />
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">Datos de inflación proporcionados por Argentina Datos API</p>
          
          <div className="mt-4 mb-3 flex items-center justify-center">
            <a 
              href="https://x.com/marcoporracin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            >
              <Twitter className="w-4 h-4 text-blue-400" />
              <span>
                ¿Encontraste un error o querés sugerir un cambio? Contactame en X
              </span>
            </a>
          </div>
          
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} devalu.ar - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;