export class BoolNode<V = unknown> {
  'true':  Set<V>
  'false': Set<V>

  constructor() {
    this.true = new Set()
    this.false = new Set()
  }

  insert(value: V, bool: boolean): void {
    if (bool) {
      this.true.add(value)
    } else {
      this.false.add(value)
    }
  }

  delete(value: V, bool: boolean): void {
    if (bool) {
      this.true.delete(value)
    } else {
      this.false.delete(value)
    }
  }

  getSize(): number {
    return this.true.size + this.false.size
  }

  toJSON(): any {
    return {
      true: Array.from(this.true),
      false: Array.from(this.false)
    }
  }

  static fromJSON<V>(json: any): BoolNode<V> {
    const node = new BoolNode<V>()
    node.true = new Set(json.true)
    node.false = new Set(json.false)
    return node
  }
}