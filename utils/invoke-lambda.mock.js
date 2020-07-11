module.exports = lambda = {
  invoke: (invokeParams) => {
    return {
      promise: () => {
        if (invokeParams.FunctionName == 'FORCE_LAMBDA_ERROR')
          return Promise.reject({ message: 'errorMessage' })

        if (invokeParams.FunctionName == 'FORCE_FUNCTION_ERROR')
          return Promise.reject({ FunctionError: 'some-error', Payload: JSON.stringify({ errorMessage: 'errorMessage' }) })

        return Promise.resolve({ Payload: JSON.stringify({}) })
      }
    }
  }
}