use std::{collections::BTreeMap, hash::Hash};

pub type TokenScore<StringRef> = (StringRef, f64);

// Adapted from https://github.com/lovasoa/fast_array_intersect
// MIT Licensed (https://github.com/lovasoa/fast_array_intersect/blob/master/LICENSE)
// while on tag https://github.com/lovasoa/fast_array_intersect/tree/v1.1.0
//
// Note: StringRef is a generic type parameter to allow for using either &str or String, helping avoiding new String allocations.
pub fn intersect_token_scores<StringRef>(
  arrays: Vec<Vec<TokenScore<StringRef>>>,
) -> Vec<TokenScore<StringRef>>
where
  StringRef: AsRef<str> + std::cmp::Eq + Hash + std::cmp::Ord,
{
  let size = arrays.len();
  if size == 0 {
    return vec![];
  }

  let mut arrays = arrays;

  // place the smallest array first
  for i in 1..size {
    if arrays[i].len() < arrays[0].len() {
      arrays.swap(0, i);
    }
  }

  // TODO: explore using something like `HashMap::with_capacity()`, but with a non-random initialization state
  let mut set: BTreeMap<StringRef, (usize, f64)> = BTreeMap::new();

  // preload destructive iterator, which allows us to avoid any new String allocations
  let mut arrays_iterator = arrays.into_iter().enumerate();

  // initialize set from the first array, advancing `arrays_iterator` by 1 position
  if let Some((_, array)) = arrays_iterator.next() {
    for (doc_id, score) in array.into_iter() {
      set.insert(doc_id, (1, score));
    }
  }

  // process the rest of the arrays
  for (i, array) in arrays_iterator {
    let mut found: usize = 0;

    for (elem_doc_id, elem_score) in array {
      if let Some((count, score)) = set.get_mut(&elem_doc_id) {
        if *count == i {
          // mutate the value matching key `elem_doc_id` in place
          {
            *count += 1;
            *score += elem_score;
          }

          found += 1;
        }
      }
    }

    if found == 0 {
      return vec![];
    }
  }

  let result: Vec<TokenScore<StringRef>> = set
    .into_iter()
    .filter_map(|(token, (count, score))| if count == size { Some((token, score)) } else { None })
    .collect();

  result
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn intersect_2_or_more_arrays() {
    let arrays: Vec<Vec<TokenScore<&str>>> = vec![
      vec![("foo", 1.0), ("bar", 1.0), ("baz", 2.0)],
      vec![("foo", 4.0), ("quick", 10.0), ("brown", 3.0), ("bar", 2.0)],
      vec![("fox", 12.0), ("foo", 4.0), ("bar", 6.0)],
    ];

    assert_eq!(intersect_token_scores(arrays), vec![("bar", 9.0), ("foo", 9.0)]);
  }

  #[test]
  fn intersect_works_with_no_token_scores() {
    let arrays: Vec<Vec<TokenScore<&str>>> = vec![vec![]];
    assert_eq!(intersect_token_scores(arrays), vec![]);
  }
}
