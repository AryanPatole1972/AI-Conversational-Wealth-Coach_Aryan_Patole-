import React from 'react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to AI Wealth Coach</h2>
        
        <div className="space-y-4 text-gray-700">
          <p className="font-semibold text-lg">Important Disclaimer</p>
          
          <p>
            This AI Wealth Coach is an <strong>educational tool only</strong>. It is designed to help you 
            understand financial concepts and learn about different investment options.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="font-semibold text-yellow-800">This tool does NOT provide:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-yellow-700">
              <li>Personalized financial advice</li>
              <li>Specific investment recommendations</li>
              <li>Tax planning guidance</li>
              <li>Legal advice</li>
            </ul>
          </div>

          <p>
            All projections, calculations, and information provided are for educational purposes only. 
            Actual investment results may vary significantly and past performance does not guarantee future results.
          </p>

          <p>
            <strong>For personalized financial advice,</strong> please consult with a licensed financial advisor 
            who can review your complete financial situation and provide recommendations tailored to your specific needs.
          </p>

          <p className="text-sm text-gray-600">
            By clicking "I Understand", you acknowledge that you have read and understood this disclaimer.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          I Understand - Continue to Learn
        </button>
      </div>
    </div>
  );
};
