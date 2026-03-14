import React from 'react';
import { UserProfile, ProjectionScenario } from '../types';

interface FinancialDashboardProps {
  userProfile: UserProfile | null;
  projectionData?: ProjectionScenario[] | null;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ userProfile, projectionData }) => {
  if (!userProfile) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Financial Summary</h2>
        <p className="text-gray-500 text-center py-8">
          Complete the onboarding to see your financial summary
        </p>
      </div>
    );
  }

  const { income, expenses, surplus } = userProfile;
  const surplusColor = surplus >= 0 ? 'text-green-600' : 'text-red-600';
  const surplusBgColor = surplus >= 0 ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Financial Summary</h2>
      
      <div className="space-y-4">
        {/* Income */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-blue-600">
                ${income.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-orange-600">
                ${expenses.toLocaleString()}
              </p>
            </div>
            <div className="text-3xl">💳</div>
          </div>
        </div>

        {/* Surplus */}
        <div className={`${surplusBgColor} rounded-lg p-4 border-2 ${surplus >= 0 ? 'border-green-200' : 'border-red-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Available for Investment</p>
              <p className={`text-2xl font-bold ${surplusColor}`}>
                ${Math.abs(surplus).toLocaleString()}
              </p>
              {surplus < 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Expenses exceed income
                </p>
              )}
            </div>
            <div className="text-3xl">{surplus >= 0 ? '📈' : '⚠️'}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Expense Ratio</span>
            <span>{income > 0 ? Math.round((expenses / income) * 100) : 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                expenses / income > 1 ? 'bg-red-500' : expenses / income > 0.8 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((expenses / income) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Goals */}
        {userProfile.goals && userProfile.goals.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700 mb-2">Your Goals:</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.goals.map((goal, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projection Summaries */}
        {projectionData && projectionData.length > 0 && surplus > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-semibold text-gray-700 mb-3">Investment Projections</p>
            <div className="space-y-2">
              {[5, 10, 20].map((years) => {
                const moderateScenario = projectionData.find(s => s.label.includes('Moderate'));
                if (!moderateScenario || years >= moderateScenario.values.length) return null;
                
                const projectedValue = moderateScenario.values[years];
                
                return (
                  <div key={years} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-600">{years} Year Projection</p>
                        <p className="text-lg font-bold text-indigo-600">
                          ${projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-8 flex items-end justify-end space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 bg-indigo-400 rounded-t"
                              style={{ height: `${((i + 1) / 5) * 100}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              Based on moderate growth scenario. Actual results may vary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
