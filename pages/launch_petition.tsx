import React from "react";
import StepOne from "../components/Petititon/Steps/StepOne";
import StepTwo from "../components/Petititon/Steps/StepTwo";
import StepThree from "../components/Petititon/Steps/StepThree";
import StepBar from "../components/Petititon/Steps/StepBar"

function LaunchPetititon() {
  const [step, setStep] = React.useState<number>(0);

  const handleFormSubmit = (step) => {
    //console.log('handle form ok', step)
    setStep(step);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 mx-10">
      <div className="mb-10 w-full">
        <StepBar id={1} name="" status={""} href="" />
      </div>
      <div>
        {step == 0 && <StepOne onSUbmit={handleFormSubmit} />}
        {step == 1 && <StepTwo onSUbmit={handleFormSubmit} />}
        {step == 2 && <StepThree onSUbmit={handleFormSubmit} />}
      </div>
    </div>
  );
}

export default LaunchPetititon;
