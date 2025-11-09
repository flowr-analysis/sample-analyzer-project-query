import { FlowrAnalyzerBuilder } from '@eagleoutice/flowr/project/flowr-analyzer-builder';
import { jsonReplacer } from '@eagleoutice/flowr/util/json';
import { fileProtocol } from '@eagleoutice/flowr/r-bridge/retriever.js';
import fs from 'fs';
import { query } from './query';
import { log, LogLevel } from '@eagleoutice/flowr/util/log';

async function main(folder: string, outputFile: string) {
   log.updateSettings(s => {
      s.settings.minLevel = LogLevel.Fatal;
   });

   const analyzer = await new FlowrAnalyzerBuilder()
      .setEngine('tree-sitter')
      .add(fileProtocol + folder)
      .build();

   try {
      const time = Date.now();
      const results = await analyzer.query(query);
      const resultString = JSON.stringify(results, jsonReplacer, 2);
      fs.writeFileSync(outputFile, resultString, 'utf-8');
      console.log(`Results written to ${outputFile} 
   * ${Object.entries(results).length} results (serialized: ${resultString.length} chars)
   * considered ${analyzer.inspectContext().files.loadingOrder.getLoadingOrder().length} files
   * took ${Date.now() - time}ms`);
   } finally {
      analyzer.close();
   }
}
if(process.argv.length < 4) {
   console.error('Usage: ts-node src/main.ts <folder> <output-file>');
   process.exit(1);
}

const folder = process.argv[2];
const outputFile = process.argv[3];

void main(folder, outputFile).catch(err => {
   console.error('Error during analysis:', err);
   process.exit(1);
});