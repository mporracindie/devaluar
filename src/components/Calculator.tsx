import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { InflationData } from '../types';

interface CalculatorProps {
  inflationData: InflationData[];
}

export function Calculator({ inflationData }: CalculatorProps) {
  const [amount, setAmount] = useState<number>(1000);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Set default dates when component mounts
  useEffect(() => {
    // Set default start date to January of current year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    setStartDate(`2010-01`);
    
    // Set default end date to current month and year
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    setEndDate(`${currentYear}-${currentMonth}`);
  }, []);

  // Calculate result when inputs change
  useEffect(() => {
    if (amount && startDate && endDate && inflationData.length > 0) {
      calculateResult();
    }
  }, [amount, startDate, endDate, inflationData]);

  const calculateResult = () => {
    // Sort inflation data by date
    const sortedData = [...inflationData].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    // Find the starting and ending points in the inflation data
    const startIndex = sortedData.findIndex(
      data => data.fecha.startsWith(startDate)
    );
    
    let endIndex = sortedData.findIndex(
      data => data.fecha.startsWith(endDate)
    );
    
    // If end date is not found, use the latest available data
    if (endIndex === -1) {
      endIndex = sortedData.length - 1;
    }

    if (startIndex === -1) {
      setResult(amount);
      setMultiplier(1);
      return;
    }

    // Calculate cumulative inflation
    let currentValue = amount;
    let cumulativeMultiplier = 1;
    
    for (let i = startIndex; i <= endIndex; i++) {
      if (i < sortedData.length) {
        const inflationRate = sortedData[i].valor / 100;
        currentValue *= (1 + inflationRate);
        cumulativeMultiplier *= (1 + inflationRate);
      }
    }

    setResult(Math.round(currentValue));
    setMultiplier(parseFloat(cumulativeMultiplier.toFixed(2)));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    }
  };

  // Add reset function
  const resetCalculator = () => {
    setAmount(1000);
    
    // Reset to default dates
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    setStartDate(`${currentYear}-01`);
    
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    setEndDate(`${currentYear}-${currentMonth}`);
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      {/* Accordion Header */}
      <button 
        onClick={toggleAccordion}
        className="w-full p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-2">
            <CalculatorIcon className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Calculadora de inflación</h3>
        </div>
        
        <div className="flex items-center">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-gray-100">
          <div className="flex justify-end mb-4">
            <button 
              onClick={resetCalculator}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Monto original
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-8 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  min="1"
                  inputMode="numeric"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ingresá el monto que querés actualizar por inflación
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha inicial (AAAA-MM)
                </label>
                <input
                  type="month"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fecha desde la cual querés calcular la inflación
                </p>
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha final (AAAA-MM)
                </label>
                <input
                  type="month"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Por defecto, la fecha final es el mes actual
                </p>
              </div>
            </div>
          </div>
          
          {result !== null && multiplier !== null && (
            <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Valor original:</span>
                <span className="font-semibold">$ {amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">Multiplicador:</span>
                <span className="font-medium text-green-600">{multiplier}x</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-sm text-gray-500">Valor actualizado:</span>
                <span className="font-bold text-blue-600">$ {result.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 