"use client";

import { useTranslations } from "next-intl";

interface StepperProps {
      currentStep: number;
}

const STEPS = [
      { number: 1, labelKey: "steps.1" },
      { number: 2, labelKey: "steps.2" },
      { number: 3, labelKey: "steps.3" },
];

export const Stepper = ({ currentStep }: StepperProps) => {
      const t = useTranslations("authentication.register");

      return (
            <div className="flex items-start justify-between relative px-2">

                  {STEPS.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isActive    = currentStep === step.number;

                        return (
                              <div key={step.number} className="flex flex-col items-center gap-2 z-10">

                                    <div className={[
                                          "w-10 h-10 rounded-full flex items-center justify-center",
                                          "font-bold text-sm transition-colors duration-300",
                                          isCompleted || isActive
                                          ? "bg-secondary-500 text-white"
                                          : "bg-white border-2 border-gris-200 text-gris-400",
                                          ].join(" ")}
                                    >
                                          {step.number}
                                    </div>

                                    <span className={[
                                          "text-xs text-center max-w-20 leading-tight",
                                          isActive ? "text-gris-800 font-medium" : "text-gris-400",
                                          ].join(" ")}
                                    >
                                          {t(step.labelKey as any)}
                                    </span>

                              </div>
                        );
                  })}

                  <div className="absolute top-5 left-0 w-full h-[2px] bg-gris-100 z-0" />

                  <div
                        className="absolute top-5 left-0 h-[2px] bg-secondary-500 transition-all duration-500 z-0"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                  />

            </div>
      );
};