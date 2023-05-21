export default function groupBy2<T, K extends string | number>(list: T[], iteratee: (t: T) => K) {
  const groups: any = new Map<K, T[]>()

  for (const item of list) {
    const key = iteratee(item)
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key).push(item)
  }
  return groups
}
