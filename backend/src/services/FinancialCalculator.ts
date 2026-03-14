import { ProjectionScenario } from '../types/index.js';

export class FinancialCalculator {
  calculateSurplus(income: number, expenses: number): number {
    return income - expenses;
  }

  calculateCompoundGrowth(
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    years: number
  ): number[] {
    if (years < 1 || years > 30) {
      throw new Error('Years must be between 1 and 30');
    }
    if (principal < 0) {
      throw new Error('Principal must be non-negative');
    }
    if (monthlyContribution < 0) {
      throw new Error('Monthly contribution must be non-negative');
    }

    const monthlyRate = annualRate / 12;
    const values: number[] = [];
    
    // Calculate for each year
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      
      // Future value of principal: P(1+r)^t
      const principalFV = principal * Math.pow(1 + monthlyRate, months);
      
      // Future value of monthly contributions: PMT × [((1+r)^t - 1) / r]
      let contributionFV = 0;
      if (monthlyRate > 0 && monthlyContribution > 0) {
        contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      } else if (monthlyContribution > 0) {
        contributionFV = monthlyContribution * months;
      }
      
      values.push(Math.round(principalFV + contributionFV));
    }
    
    return values;
  }

  generateScenarios(
    principal: number,
    monthlyContribution: number,
    years: number
  ): ProjectionScenario[] {
    const scenarios: ProjectionScenario[] = [
      {
        label: 'Conservative (5%)',
        returnRate: 0.05,
        values: this.calculateCompoundGrowth(principal, monthlyContribution, 0.05, years),
        metadata: {
          assumptions: 'Based on conservative fixed-income investments like bonds and fixed deposits',
          disclaimer: 'These projections are educational estimates only and not guaranteed returns. Actual results may vary.',
        },
      },
      {
        label: 'Moderate (8%)',
        returnRate: 0.08,
        values: this.calculateCompoundGrowth(principal, monthlyContribution, 0.08, years),
        metadata: {
          assumptions: 'Based on balanced portfolio with mix of stocks and bonds',
          disclaimer: 'These projections are educational estimates only and not guaranteed returns. Actual results may vary.',
        },
      },
      {
        label: 'Optimistic (12%)',
        returnRate: 0.12,
        values: this.calculateCompoundGrowth(principal, monthlyContribution, 0.12, years),
        metadata: {
          assumptions: 'Based on equity-heavy portfolio with higher risk tolerance',
          disclaimer: 'These projections are educational estimates only and not guaranteed returns. Actual results may vary.',
        },
      },
    ];

    return scenarios;
  }

  validateProjectionParams(principal: number, monthly: number, years: number): { valid: boolean; error?: string } {
    if (principal < 0) {
      return { valid: false, error: 'Principal amount must be non-negative' };
    }
    if (monthly < 0) {
      return { valid: false, error: 'Monthly contribution must be non-negative' };
    }
    if (years < 1 || years > 30) {
      return { valid: false, error: 'Years must be between 1 and 30' };
    }
    if (!Number.isFinite(principal) || !Number.isFinite(monthly) || !Number.isFinite(years)) {
      return { valid: false, error: 'All parameters must be valid numbers' };
    }
    return { valid: true };
  }
}
