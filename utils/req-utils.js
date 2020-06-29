exports.then = (result) => {
  const isError = result != undefined && result.errorMessage != undefined;

  console.log(`
    =======================================================
    |         ${isError ? ' ' : ''}              ${isError ? 'ERROR' : 'SUCCESS'}            ${isError ? ' ' : ''}           |
    =======================================================
  `,
    result == undefined ? result : JSON.stringify(result, null, 2))
};


exports.catch = (result) => {

  console.log(`
    =======================================================
    |                        CATCH                        |
    =======================================================
`,
    result)
};

