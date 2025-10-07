"use client";
import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : index === currentStep
                    ? 'bg-white border-indigo-600 text-indigo-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}