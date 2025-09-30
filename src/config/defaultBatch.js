// Root level: Multiple batch records (as a list/array)
const gloveBatches = [
  {
    gloveBatchId: String,
    productType: String,
    latexBatchId: String,
    batchCount: Number,
    description: String,
    status: String,
    createdDate: String,
    manufacturingDate: Date, // ISO string or Date object

    // Array/object structure for real-time monitoring
    continuousMonitoring: {
      sectionName: String,
      description: String,
      monitoredParameters: [
        {
          parameterName: String,
          metric: String,
          interval: String,
        },
      ],
    },

    // Nested process steps: Modular, extensible
    dippingProcess: {
      compoundPrep: {
        compoundRecipeId: String,
        monitoredData: [
          {
            parameterName: String,
            value: Number | String,
            metric: String,
          },
        ],
        calculatedParameters: [
          {
            parameterName: String,
            formula: String,
            description: String,
            value: Number | String,
            metric: String,
            target: String,
            status: String,
          },
        ],
      },
      formerPrep: {
        monitoredData: [
          {
            parameterName: String,
            value: Number | String,
            metric: String,
          },
        ],
      },
      latexDipping: {
        monitoredData: [
          {
            parameterName: String,
            value: Number | String,
            metric: String,
          },
        ],
      },
    },

    // Post-dipping can be dynamically structured by steps
    postDipping: {
      leaching: {
        monitoredData: [
          {
            parameterName: String,
            value: Number | String,
            metric: String,
          },
        ],
      },
      curing: {
        monitoredData: [
          {
            parameterName: String,
            value: Number | String,
            metric: String,
          },
        ],
      },
      finishing: {
        monitoredData: [
          {
            parameterName: String,
            value: Number | String,
            metric: String,
          },
        ],
      },
    },

    // Quality control with extensible arrays
    qualityControlResults: {
      labTestData: [
        {
          testName: String,
          inputs: [
            {
              parameterName: String,
              value: Number | String,
              metric: String,
            },
          ],
        },
      ],
      calculatedParameters: [
        {
          parameterName: String,
          formula: String,
          description: String,
          value: Number | String,
          metric: String,
          target: String,
          status: String,
        },
      ],
    },
  },
  // , ... More batches
];
