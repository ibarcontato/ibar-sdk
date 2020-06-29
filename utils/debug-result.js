module.exports = async function debugResult(method) {
  function _then(result) {
    setTimeout(() => { }, 1000);
    console.log(` 
      =======================================================
      |                      'SUCCESS'                      |
      =======================================================
    `);
    console.log(JSON.stringify(result, null, 2))
  };


  function _catch(result) {
    setTimeout(() => { }, 1000);
    console.log(`
      =======================================================
      |                        CATCH                        |
      =======================================================
    `)
    if (typeof result == 'object') console.log(JSON.stringify(result, null, 2))
    else console.log(JSON.stringify(JSON.parse(result), null, 2), '\n\n')
  };

  try {
    method.then(_then).catch(_catch)
  } catch (_) {
    console.log(` 
      =======================================================
      |                        'SYNC'                       |
      =======================================================
    `);
    console.log(JSON.stringify(method, null, 2))
  }
}
