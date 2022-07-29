
# Benchmarks

The following is an automated benchmark performed on the [Divina Commedia](https://en.wikipedia.org/wiki/Divina_Commedia) dataset. <br />
You can find the full dataset [here](https://github.com/nearform/lyra/blob/main/packages/benchmarks/dataset/divinaCommedia.json).

# Results


| Search             | Term                                  | Properties | Typo tolerance | Time Elapsed  | Results     |
|--------------------|---------------------------------------|------------|----------------|---------------|-------------|
| **Exact search**   | `"stelle"`                          | `["txt"]`| `N/A`        | 319μs | 25 |
| **Exact search**   | `"stelle"`                          | `"*"`    | `N/A`        | 75μs | 25 |
| **Typo tolerance** | `"stele"`                           | `"*"`    | `1`          | 842μs | 28 | 
| **Exact search**   | `"onde si muovono a diversi porti"` | `"*"`    | `N/A`        | 389μs | 268 | 
| **Typo tolerance** | `"ode si mossero a divisi porte"`   | `"*"`    | `5`          | 52ms | 43023 | 
| **Typo tolerance** | `"ode si mossero a divisi porte"`   | `["txt"]`| `5`          | 10ms | 7430 |


