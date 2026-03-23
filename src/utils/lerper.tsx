export class Lerper {
  static lerp<T>(condition: boolean, node1: T, node2: T): T {
    return condition ? node1 : node2;
  }
}
