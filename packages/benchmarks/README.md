
# Benchmarks

The following is an automated benchmark performed on the [Divina Commedia](https://en.wikipedia.org/wiki/Divina_Commedia) dataset. <br />
You can find the full dataset [here](https://github.com/nearform/lyra/blob/main/packages/benchmarks/dataset/divinaCommedia.json).

# Results


| Search             | Term                                  | Properties | Typo tolerance | Time Elapsed  | Results     |
|--------------------|---------------------------------------|------------|----------------|---------------|-------------|
| **Exact search**   | `"stelle"`                          | `["txt"]`| `N/A`        | 294μs | 25 |
| **Exact search**   | `"stelle"`                          | `"*"`    | `N/A`        | 64μs | 25 |
| **Typo tolerance** | `"stele"`                           | `"*"`    | `1`          | 748μs | 28 | 
| **Exact search**   | `"onde si muovono a diversi porti"` | `"*"`    | `N/A`        | 191μs | 135 | 
| **Typo tolerance** | `"ode si mossero a divisi porte"`   | `"*"`    | `5`          | 53ms | 14097 | 
| **Typo tolerance** | `"ode si mossero a divisi porte"`   | `["txt"]`| `5`          | 4ms | 5544 |


