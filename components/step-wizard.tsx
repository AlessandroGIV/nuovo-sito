"use client"

import { Check } from "lucide-react"

interface StepWizardProps {
  currentStep: number
  steps: string[]
}

export function StepWizard({ currentStep, steps }: StepWizardProps) {
  return (
    <div className="w-full py-1">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1 relative">
              {/* Line before step (except first) */}
              {index > 0 && (
                <div
                  className={`absolute top-5 right-1/2 w-full h-0.5 -z-10 transition-colors ${
                    isCompleted ? "bg-[#FFC300]" : "bg-white/20"
                  }`}
                  style={{ transform: "translateX(50%)" }}
                />
              )}

              {/* Step circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all mb-2 ${
                  isCompleted
                    ? "bg-[#FFC300] text-[#072534]"
                    : isCurrent
                      ? "bg-[#FFC300] text-[#072534] ring-4 ring-[#FFC300]/30"
                      : "bg-white/10 text-white/50"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>

              {/* Step label - hidden on mobile for middle steps */}
              <span
                className={`text-xs md:text-sm font-medium transition-colors text-center ${
                  isCurrent ? "text-[#FFC300]" : isCompleted ? "text-white" : "text-white/50"
                } ${index > 0 && index < steps.length - 1 ? "hidden md:block" : ""}`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
