import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dbContext } from "../db/dbContext";
import { format } from "date-fns";

export const fetchBatchList = createAsyncThunk("batchList/fetch", async () => {
  const batchLs = await dbContext.settings.get(1);
  //console.log(batchLs);
  return batchLs;
});
const now = new Date();
const savedDate = format(now, "dd-MM-yyyy HH:mm:ss");
const stepsTemplate = [
  { processType: "latexPreparation", data: {}, photo: null, saved: false },
  { processType: "formerPreparation", data: {}, photo: null, saved: false },
  { processType: "leaching", data: {}, photo: null, saved: false },
  { processType: "finishing", data: {}, photo: null, saved: false },
  { processType: "qc", data: {}, photo: null, saved: false },
];

const initialState = { batchLs: [], activeBatch: {} };

const batchListSlice = createSlice({
  name: "batchList",
  initialState,
  reducers: {
    add(state, action) {
      // Ensure steps array is present!
      const batch = {
        ...action.payload,
        steps: stepsTemplate.map((s) => ({ ...s })),
      };
      state.batchLs.push(batch);
    },
    remove(state, action) {
      state.batchLs = state.batchLs.filter(
        (item) => item.gloveBatchId !== action.payload
      );
    },
    setActiveBatch(state, action) {
      state.activeBatch = action.payload;
    },
    updateStep(state, action) {
      const { batchId, stepIdx, formData, photo } = action.payload;
      const batch = state.batchLs.find((b) => b.gloveBatchId === batchId);
      if (!batch || !batch.steps) return;

      batch.status = "In progress";
      batch.steps = batch.steps.map((s, i) =>
        i === stepIdx
          ? { ...s, data: formData, photo, saved: true, saved_date: savedDate }
          : s
      );

      // Update activeBatch safely
      if (state.activeBatch?.gloveBatchId === batchId) {
        state.activeBatch = {
          ...batch,
          steps: batch.steps.map((s) => ({ ...s })),
        };
      }

      // Optional: auto-mark next step as unlocked
      const allSavedExceptQC = batch.steps
        .slice(0, 4)
        .every((s) => s.saved === true);
      if (allSavedExceptQC) {
        batch.status = "In QC";
      }
    },
    markAsQCBatch(state, action) {
      const batchId = action.payload;
      const batch = state.batchLs.find((b) => b.gloveBatchId === batchId);
      if (batch) batch.status = "In QC";
      if (state.activeBatch && state.activeBatch.gloveBatchId === batchId) {
        state.activeBatch.status = "In QC";
      }
    },
    updateQCBatch(state, action) {
      const { batchId, qcResultData, photo, saved } = action.payload;
      const batchIndex = state.batchLs.findIndex(
        (b) => b.gloveBatchId === batchId
      );
      const batch = state.batchLs[batchIndex];
      if (batchIndex != -1 && batch) {
        if (batch.steps && batch.steps[4]) {
          batch.steps[4] = {
            ...batch.steps[4],
            data: qcResultData,
            saved: saved,
            saved_date: saved ? savedDate : null,
          };
        }
        if (saved) {
          batch.status = "Completed";
        }
        state.batchLs[batchIndex] = batch;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBatchList.fulfilled, (state, action) => {
      console.log( action.payload?.data )
      return (state = action.payload?.data || {
        "batchLs": [
            {
                "gloveBatchId": 10001,
                "status": "In progress",
                "createdDate": "16/10/2025",
                "batchCount": "100",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {
                            "sulfur": "5 grams",
                            "zincOxide": "3 grams",
                            "accelerators": "1 grams",
                            "antioxidants": "1 grams",
                            "stabilizers": "2 grams",
                            "compoundingTime": "10 minutes",
                            "compoundingTemp": "60 °C",
                            "compoundViscosity": "500 cP",
                            "finalPh": "7 pH"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {
                            "waterTemp": "25 °C",
                            "chlorineConc": "200 ppm",
                            "coagulantPh": "4 pH",
                            "immersionSpeed": "10 cm/s",
                            "dwellTime": "60 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "leaching",
                        "data": {
                            "waterTemp": "40 °C",
                            "flowRate": "50 L/min",
                            "duration": "60 minutes"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "finishing",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "qc",
                        "data": {},
                        "photo": null,
                        "saved": false
                    }
                ]
            },
            {
                "gloveBatchId": 10002,
                "status": "Completed",
                "createdDate": "16/10/2025",
                "batchCount": "200",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {
                            "sulfur": "5 grams",
                            "zincOxide": "3 grams",
                            "accelerators": "1 grams",
                            "antioxidants": "1.5 grams",
                            "stabilizers": "2 grams",
                            "compoundingTime": "10 minutes",
                            "compoundingTemp": "60 °C",
                            "compoundViscosity": "2000 cP",
                            "finalPh": "8 pH"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {
                            "waterTemp": "45 °C",
                            "chlorineConc": "200 ppm",
                            "coagulantPh": "6 pH",
                            "immersionSpeed": "10 cm/s",
                            "dwellTime": "60 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "leaching",
                        "data": {
                            "waterTemp": "40 °C",
                            "flowRate": "50 L/min",
                            "duration": "60 minutes"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "finishing",
                        "data": {
                            "rollerSpeed": "300 rpm",
                            "rollerPressure": "1 MPa",
                            "powderedGloves": "yes yes/no",
                            "polymerConc": "17 g/L",
                            "cornstarchThickness": " mm",
                            "chlorineConcentration": "200 ppm",
                            "chlorineTime": "10 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "qc",
                        "data": [
                            {
                                "type": "Visual inspection",
                                "results": {
                                    "visualInspectionMethod": "Test",
                                    "defectType": "Test",
                                    "visualDefectCount": "20"
                                }
                            },
                            {
                                "type": " Water-tightness test",
                                "results": {
                                    "waterTightnessAql": "2",
                                    "waterTightnessPassCount": "100",
                                    "waterTightnessFailCount": "10"
                                }
                            },
                            {
                                "type": "Physical property tests",
                                "results": {
                                    "forceAtBreak": "18",
                                    "elongationAtBreak": "900",
                                    "tensileStrength": "30"
                                }
                            },
                            {
                                "type": "Dimensional tests",
                                "results": {
                                    "gloveLength": "220",
                                    "palmWidth": "70",
                                    "gloveThickness": "0.2"
                                }
                            },
                            {
                                "type": "Sterility test",
                                "results": {
                                    "sterilityResult": "pass"
                                }
                            },
                            {
                                "type": "Biocompatibility test",
                                "results": {
                                    "biocompatibilityResult": "fail"
                                }
                            },
                            {
                                "type": "Packaging data",
                                "results": {
                                    "packagingID": "101",
                                    "testResultsSummary": "test",
                                    "sterilizationDetails": "test",
                                    "comments": "test"
                                }
                            }
                        ],
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    }
                ]
            },
            {
                "gloveBatchId": 10003,
                "status": "In QC",
                "createdDate": "16/10/2025",
                "batchCount": "500",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {
                            "sulfur": "5 grams",
                            "zincOxide": "3 grams",
                            "accelerators": "1 grams",
                            "antioxidants": "1 grams",
                            "stabilizers": "2 grams",
                            "compoundingTime": "10 minutes",
                            "compoundingTemp": "60 °C",
                            "compoundViscosity": "500 cP",
                            "finalPh": "7 pH"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {
                            "waterTemp": "25 °C",
                            "chlorineConc": "200 ppm",
                            "coagulantPh": "4 pH",
                            "immersionSpeed": "10 cm/s",
                            "dwellTime": "60 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "leaching",
                        "data": {
                            "waterTemp": "40 °C",
                            "flowRate": "50 L/min",
                            "duration": "60 minutes"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "finishing",
                        "data": {
                            "rollerSpeed": "50 rpm",
                            "rollerPressure": "1 MPa",
                            "powderedGloves": "no yes/no",
                            "polymerConc": " g/L",
                            "cornstarchThickness": "0.5 mm",
                            "chlorineConcentration": "200 ppm",
                            "chlorineTime": "10 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "qc",
                        "data": {},
                        "photo": null,
                        "saved": false
                    }
                ]
            },
            {
                "gloveBatchId": 10004,
                "status": "Completed",
                "createdDate": "16/10/2025",
                "batchCount": "100",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {
                            "sulfur": "0.5 grams",
                            "zincOxide": "0.1 grams",
                            "accelerators": "1 grams",
                            "antioxidants": "1 grams",
                            "stabilizers": "2 grams",
                            "compoundingTime": "10 minutes",
                            "compoundingTemp": "60 °C",
                            "compoundViscosity": "1000 cP",
                            "finalPh": "7 pH"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {
                            "waterTemp": "45 °C",
                            "chlorineConc": "200 ppm",
                            "coagulantPh": "4 pH",
                            "immersionSpeed": "10 cm/s",
                            "dwellTime": "60 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "leaching",
                        "data": {
                            "waterTemp": "80 °C",
                            "flowRate": "50 L/min",
                            "duration": "60 minutes"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "finishing",
                        "data": {
                            "rollerSpeed": "300 rpm",
                            "rollerPressure": "1 MPa",
                            "powderedGloves": "yes yes/no",
                            "polymerConc": "17 g/L",
                            "cornstarchThickness": " mm",
                            "chlorineConcentration": "200 ppm",
                            "chlorineTime": "10 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "qc",
                        "data": [
                            {
                                "type": "Visual inspection",
                                "results": {
                                    "visualInspectionMethod": "test",
                                    "defectType": "NA",
                                    "visualDefectCount": "0"
                                }
                            },
                            {
                                "type": " Water-tightness test",
                                "results": {
                                    "waterTightnessAql": "2",
                                    "waterTightnessPassCount": "100",
                                    "waterTightnessFailCount": "0"
                                }
                            },
                            {
                                "type": "Physical property tests",
                                "results": {
                                    "forceAtBreak": "6",
                                    "elongationAtBreak": "500",
                                    "tensileStrength": "14"
                                }
                            },
                            {
                                "type": "Dimensional tests",
                                "results": {
                                    "gloveLength": "220",
                                    "palmWidth": "70",
                                    "gloveThickness": "0.2"
                                }
                            },
                            {
                                "type": "Sterility test",
                                "results": {
                                    "sterilityResult": "pass"
                                }
                            },
                            {
                                "type": "Biocompatibility test",
                                "results": {
                                    "biocompatibilityResult": "pass"
                                }
                            },
                            {
                                "type": "Packaging data",
                                "results": {
                                    "packagingID": "101",
                                    "testResultsSummary": "test",
                                    "sterilizationDetails": "test",
                                    "comments": "test"
                                }
                            }
                        ],
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    }
                ]
            },
            {
                "gloveBatchId": 10005,
                "status": "In QC",
                "createdDate": "16/10/2025",
                "batchCount": "200",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {
                            "sulfur": "5 grams",
                            "zincOxide": "3 grams",
                            "accelerators": "1 grams",
                            "antioxidants": "1 grams",
                            "stabilizers": "2 grams",
                            "compoundingTime": "10 minutes",
                            "compoundingTemp": "60 °C",
                            "compoundViscosity": "500 cP",
                            "finalPh": "7 pH"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {
                            "waterTemp": "25 °C",
                            "chlorineConc": "200 ppm",
                            "coagulantPh": "4 pH",
                            "immersionSpeed": "10 cm/s",
                            "dwellTime": "60 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "leaching",
                        "data": {
                            "waterTemp": "80 °C",
                            "flowRate": "50 L/min",
                            "duration": "60 minutes"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "finishing",
                        "data": {
                            "rollerSpeed": "50 rpm",
                            "rollerPressure": "0.1 MPa",
                            "powderedGloves": "yes yes/no",
                            "polymerConc": "20 g/L",
                            "cornstarchThickness": " mm",
                            "chlorineConcentration": "200 ppm",
                            "chlorineTime": "10 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "qc",
                        "data": {},
                        "photo": null,
                        "saved": false
                    }
                ]
            },
            {
                "gloveBatchId": 10006,
                "status": "In progress",
                "createdDate": "16/10/2025",
                "batchCount": "600",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {
                            "sulfur": "3 grams",
                            "zincOxide": "3 grams",
                            "accelerators": "1 grams",
                            "antioxidants": "1 grams",
                            "stabilizers": "2 grams",
                            "compoundingTime": "10 minutes",
                            "compoundingTemp": "60 °C",
                            "compoundViscosity": "1992 cP",
                            "finalPh": "8 pH"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 13:06:05"
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "leaching",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "finishing",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "qc",
                        "data": {},
                        "photo": null,
                        "saved": false
                    }
                ]
            },
            {
                "gloveBatchId": 10007,
                "status": "Completed",
                "createdDate": "16/10/2025",
                "batchCount": "10000",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {
                            "sulfur": "5 grams",
                            "zincOxide": "3 grams",
                            "accelerators": "1 grams",
                            "antioxidants": "1 grams",
                            "stabilizers": "2 grams",
                            "compoundingTime": "10 minutes",
                            "compoundingTemp": "60 °C",
                            "compoundViscosity": "2000 cP",
                            "finalPh": "7 pH"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 16:13:20"
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {
                            "waterTemp": "25 °C",
                            "chlorineConc": "200 ppm",
                            "coagulantPh": "4 pH",
                            "immersionSpeed": "5 cm/s",
                            "dwellTime": "60 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 16:13:20"
                    },
                    {
                        "processType": "leaching",
                        "data": {
                            "waterTemp": "40 °C",
                            "flowRate": "50 L/min",
                            "duration": "60 minutes"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 16:13:20"
                    },
                    {
                        "processType": "finishing",
                        "data": {
                            "rollerSpeed": "50 rpm",
                            "rollerPressure": "1 MPa",
                            "powderedGloves": "yes yes/no",
                            "polymerConc": "20 g/L",
                            "cornstarchThickness": " mm",
                            "chlorineConcentration": "800 ppm",
                            "chlorineTime": "120 seconds"
                        },
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 16:13:20"
                    },
                    {
                        "processType": "qc",
                        "data": [
                            {
                                "type": "Visual inspection",
                                "results": {
                                    "visualInspectionMethod": "Test",
                                    "defectType": "NA",
                                    "visualDefectCount": "0"
                                }
                            },
                            {
                                "type": " Water-tightness test",
                                "results": {
                                    "waterTightnessAql": "0.25",
                                    "waterTightnessPassCount": "100",
                                    "waterTightnessFailCount": "0"
                                }
                            },
                            {
                                "type": "Physical property tests",
                                "results": {
                                    "forceAtBreak": "10",
                                    "elongationAtBreak": "500",
                                    "tensileStrength": "30"
                                }
                            },
                            {
                                "type": "Dimensional tests",
                                "results": {
                                    "gloveLength": "220",
                                    "palmWidth": "70",
                                    "gloveThickness": "0.2"
                                }
                            },
                            {
                                "type": "Sterility test",
                                "results": {
                                    "sterilityResult": "pass"
                                }
                            },
                            {
                                "type": "Biocompatibility test",
                                "results": {
                                    "biocompatibilityResult": "pass"
                                }
                            },
                            {
                                "type": "Packaging data",
                                "results": {
                                    "packagingID": "101",
                                    "testResultsSummary": "Test",
                                    "sterilizationDetails": "Test",
                                    "comments": "Test"
                                }
                            }
                        ],
                        "photo": null,
                        "saved": true,
                        "saved_date": "16-10-2025 16:13:20"
                    }
                ]
            },
            {
                "gloveBatchId": 10008,
                "status": "Yet to start",
                "createdDate": "16/10/2025",
                "steps": [
                    {
                        "processType": "latexPreparation",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "formerPreparation",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "leaching",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "finishing",
                        "data": {},
                        "photo": null,
                        "saved": false
                    },
                    {
                        "processType": "qc",
                        "data": {},
                        "photo": null,
                        "saved": false
                    }
                ]
            }
        ],
        "activeBatch": {
            "gloveBatchId": 10003,
            "status": "In QC",
            "createdDate": "16/10/2025",
            "batchCount": "500",
            "steps": [
                {
                    "processType": "latexPreparation",
                    "data": {
                        "sulfur": "5 grams",
                        "zincOxide": "3 grams",
                        "accelerators": "1 grams",
                        "antioxidants": "1 grams",
                        "stabilizers": "2 grams",
                        "compoundingTime": "10 minutes",
                        "compoundingTemp": "60 °C",
                        "compoundViscosity": "500 cP",
                        "finalPh": "7 pH"
                    },
                    "photo": null,
                    "saved": true,
                    "saved_date": "16-10-2025 13:06:05"
                },
                {
                    "processType": "formerPreparation",
                    "data": {
                        "waterTemp": "25 °C",
                        "chlorineConc": "200 ppm",
                        "coagulantPh": "4 pH",
                        "immersionSpeed": "10 cm/s",
                        "dwellTime": "60 seconds"
                    },
                    "photo": null,
                    "saved": true,
                    "saved_date": "16-10-2025 13:06:05"
                },
                {
                    "processType": "leaching",
                    "data": {
                        "waterTemp": "40 °C",
                        "flowRate": "50 L/min",
                        "duration": "60 minutes"
                    },
                    "photo": null,
                    "saved": true,
                    "saved_date": "16-10-2025 13:06:05"
                },
                {
                    "processType": "finishing",
                    "data": {
                        "rollerSpeed": "50 rpm",
                        "rollerPressure": "1 MPa",
                        "powderedGloves": "no yes/no",
                        "polymerConc": " g/L",
                        "cornstarchThickness": "0.5 mm",
                        "chlorineConcentration": "200 ppm",
                        "chlorineTime": "10 seconds"
                    },
                    "photo": null,
                    "saved": true,
                    "saved_date": "16-10-2025 13:06:05"
                },
                {
                    "processType": "qc",
                    "data": {},
                    "photo": null,
                    "saved": false
                }
            ],
            "derivedStatus": "In QC",
            "isFinished": false
        }
    })
    });
  },
});

export const {
  add,
  remove,
  setActiveBatch,
  updateStep,
  markAsQCBatch,
  updateQCBatch,
} = batchListSlice.actions;
export default batchListSlice.reducer;
