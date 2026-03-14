import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { ProjectionScenario } from '../types';

interface CompoundingVisualizerProps {
  initialAmount: number;
  monthlyContribution: number;
  onProjectionUpdate?: (scenarios: ProjectionScenario[]) => void;
}

export const CompoundingVisualizer: React.FC<CompoundingVisualizerProps> = ({
  initialAmount: propInitialAmount,
  monthlyContribution: propMonthlyContribution,
  onProjectionUpdate,
}) => {
  const [amount, setAmount] = useState(propInitialAmount || 1000);
  const [monthly, setMonthly] = useState(propMonthlyContribution || 100);
  const [years, setYears] = useState(10);
  const [scenarios, setScenarios] = useState<ProjectionScenario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjections();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [amount, monthly, years]);

  const fetchProjections = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/calculate/projection', {
        principal: amount,
        monthly,
        years,
      });
      setScenarios(response.data.scenarios);
      
      // Call the callback if provided
      if (onProjectionUpdate) {
        onProjectionUpdate(response.data.scenarios);
      }
    } catch (error) {
      console.error('Error fetching projections:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for chart
  const chartData = scenarios.length > 0
    ? Array.from({ length: years }, (_, i) => {
        const year = i + 1;
        const dataPoint: any = { year };
        scenarios.forEach((scenario) => {
          dataPoint[scenario.label] = scenario.values[i];
        });
        return dataPoint;
      })
    : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Investment Growth Projection</h2>
      
      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Amount: ${amount.toLocaleString()}
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Contribution: ${monthly.toLocaleString()}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Horizon: {years} years
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="Conservative (5%)" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="Moderate (8%)" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="Optimistic (12%)" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Adjust the sliders to see projections
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Educational Disclaimer:</strong> These projections are educational estimates only and not guaranteed returns. 
          Actual investment results may vary significantly based on market conditions, fees, taxes, and other factors. 
          Past performance does not guarantee future results.
        </p>
      </div>

      {/* Final Values */}
      {scenarios.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {scenarios.map((scenario) => (
            <div key={scenario.label} className="bg-gray-50 rounded p-2 text-center">
              <p className="text-xs text-gray-600">{scenario.label}</p>
              <p className="text-lg font-bold text-gray-800">
                ${scenario.values[scenario.values.length - 1].toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
