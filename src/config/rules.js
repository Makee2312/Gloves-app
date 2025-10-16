// src/config/validations.js
export const processValidations = {
  latexPreparation: {
    sulfur: { min: 0.5, max: 5.0 },
    zincOxide: { min: 0.1, max: 3.0 },
    accelerators: { min: 0.05, max: 1.0 },
    antioxidants: { min: 0.05, max: 1.5 },
    stabilizers: { min: 0.05, max: 2.0 },
    compoundingTime: { min: 10, max: 120 }, // minutes
    compoundingTemp: { min: 60, max: 90 }, // °C
    compoundViscosity: { min: 500, max: 2000 }, // cP
    finalPh: { min: 6.5, max: 8.0 }, // pH
  },

  formerPreparation: {
    waterTemp: { min: 25, max: 45 }, // °C
    chlorineConc: { min: 200, max: 500 }, // ppm
    coagulantPh: { min: 4.0, max: 6.5 }, // pH
    immersionSpeed: { min: 1, max: 10 }, // cm/s
    dwellTime: { min: 5, max: 60 }, // seconds
  },
  leaching: {
    waterTemp: { min: 40, max: 80 }, // °C
    flowRate: { min: 5, max: 50 }, // L/min
    duration: { min: 5, max: 60 },
    dryingTemp: { min: 60, max: 120 }, // °C
    humidity: { min: 30, max: 70 },
    curingTemp: { min: 100, max: 130 }, // °C
    time: { min: 10, max: 60 }, // minutes
    vulcanizationStatus: { allowed: ["yes", "no"] }, // minutes
  },

  finishing: {
    rollerSpeed: { min: 50, max: 300 }, // rpm
    rollerPressure: { min: 0.1, max: 1.0 }, // MPa (approx. 1 MPa = 145 psi)
    powderedGloves: { allowed: ["yes", "no"] }, // categorical field
    polymerConc: { min: 1, max: 20 }, // g/L
    cornstarchThickness: { min: 0.05, max: 0.5 }, // mm
    chlorineConcentration: { min: 200, max: 800 }, // ppm
    chlorineTime: { min: 10, max: 120 }, // seconds
  },

  testingAndPackaging: {
    // Visual Inspection
    visualDefectCount: { min: 0, max: 20 }, // count

    // Water-tightness Test
    waterTightnessAql: { min: 0.25, max: 2.5 }, // AQL range for general to surgical gloves
  //   waterTightnessPassCount: { min: 0, max: 100 }, // count
   // waterTightnessFailCount: { min: 0, max: 10 }, // count

    // Physical Properties
    forceAtBreak: { min: 6, max: 18 }, // N
    elongationAtBreak: { min: 500, max: 900 }, // %
    tensileStrength: { min: 14, max: 35 }, // MPa

    // Dimensional Tests
    gloveLength: { min: 220, max: 300 }, // mm
    palmWidth: { min: 70, max: 120 }, // mm
    gloveThickness: { min: 0.05, max: 0.2 }, // mm

    // Sterility
    sterilityResult: { allowed: ["pass", "fail"] }, // categorical validation
    biocompatibilityResult: { allowed: ["pass", "fail"] }, // categorical validation

    // Packaging Data
    packagingID: { required: true },
    testResultsSummary: { maxLength: 500 },
    sterilizationDetails: { maxLength: 300 },
  },
};
