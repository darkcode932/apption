import React from "react";
import StepOne from "../components/Petititon/Steps/StepOne";
import StepTwo from "../components/Petititon/Steps/StepTwo";
import StepThree from "../components/Petititon/Steps/StepThree";

function LaunchPetititon() {
  const [step, setStep] = React.useState<number>(0);

  const handleFormSubmit = (step) => {
    //console.log('handle form ok', step)
    setStep(step);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div></div>
      <div>
        {step == 0 && <StepOne onSUbmit={handleFormSubmit} />}
        {step == 1 && <StepTwo onSUbmit={handleFormSubmit} />}
        {step == 2 && <StepThree onSUbmit={handleFormSubmit} />}
      </div>
    </div>
  );
}

export default LaunchPetititon;
