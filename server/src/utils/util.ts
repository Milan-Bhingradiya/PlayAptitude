export class UniqueArray<T> {
  public set: Set<T>;
  public array: T[];

  constructor() {
    this.set = new Set<T>();  // To ensure uniqueness
    this.array = [];          // To maintain indexed access
  }

  add(value: T): void {
    if (!this.set.has(value)) {
      this.set.add(value);    // Add to set to ensure uniqueness
      this.array.push(value); // Add to array for index-based access
    }
  }

  get(index: number): T | undefined {
    return this.array[index];  // Access element by index
  }

  size(): number {
    return this.array.length;  // Get the size of the array
  }

  getAll(): T[] {
    return [...this.array];    // Return a copy of the array
  }

  remove(value: T): boolean {
    if (this.set.has(value)) {
      this.set.delete(value);          // Remove from set

      const index = this.array.indexOf(value); // Find index in array
      if (index !== -1) {
        this.array.splice(index, 1);   // Remove from array by index
      }
      return true;
    }
    return false;  // Return false if the value was not found
  }
}