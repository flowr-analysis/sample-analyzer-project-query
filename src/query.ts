import { VertexType } from "@eagleoutice/flowr/dataflow/graph/vertex";
import { Query } from "@eagleoutice/flowr/queries/query";
import { Q } from "@eagleoutice/flowr/search/flowr-search-builder";

export const query: Query[] = [
   // 0. meta (allows you to map all ids back to files/lines)
   { type: 'id-map' },
   { type: 'location-map' }, // this is easier if the location suffices for you
   { type: 'project' }, // project overview
   // 1. find function definitions, where how; find nested helper function definitions too
   { type: 'search', search: Q.all().filter(VertexType.FunctionDefinition).build() },
   // 2. higher order functions (+ other inspections)
   { type: 'inspect-higher-order' },
   { type: 'inspect-exception' },
   { type: 'inspect-recursion' },
   // 3. for/repeat/while; maybe also parallel loops
   { type: 'call-context', callName: '^(for|while|repeat)$' },
   // 4. library load , percentage in the code (use location map to calc this), whether nested or not
   // 5. unique file loads and stores
   // 6. use package names or first; maybe find where they are mixed
   { type: 'dependencies' },
   // 8. vectorization ore like lapply etc. in better ways (currently incomplete, as explained)
   { type: 'call-context', callName: '^(apply|lapply|sapply|vapply|mapply|tapply)$' },
   // 11. how wide are dataframes => dataframe shape query
   { type: 'df-shape'}
];
