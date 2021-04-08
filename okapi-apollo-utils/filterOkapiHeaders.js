const filterOkapiHeaders = req => {
  const okapiHeaders = {};

  Object.entries(req?.headers ?? {})
    .filter(([key]) => key.startsWith('x-okapi-'))
    .forEach(([key, value]) => {
      okapiHeaders[key] = value;
    });

  return okapiHeaders;
}

module.exports = filterOkapiHeaders;