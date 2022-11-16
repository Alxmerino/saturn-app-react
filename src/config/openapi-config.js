const config = {
  schemaFile: 'https://amayamedia.com/open-api-specs.yaml',
  apiFile: '../services/api/emptyApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: '../services/api/saturnApi.ts',
  exportName: 'saturnApi',
  hooks: true,
};

module.exports = config;
