"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueArray = void 0;
class UniqueArray {
    constructor() {
        this.set = new Set(); // To ensure uniqueness
        this.array = []; // To maintain indexed access
    }
    add(value) {
        if (!this.set.has(value)) {
            this.set.add(value); // Add to set to ensure uniqueness
            this.array.push(value); // Add to array for index-based access
        }
    }
    get(index) {
        return this.array[index]; // Access element by index
    }
    size() {
        return this.array.length; // Get the size of the array
    }
    getAll() {
        return [...this.array]; // Return a copy of the array
    }
    remove(value) {
        if (this.set.has(value)) {
            this.set.delete(value); // Remove from set
            const index = this.array.indexOf(value); // Find index in array
            if (index !== -1) {
                this.array.splice(index, 1); // Remove from array by index
            }
            return true;
        }
        return false; // Return false if the value was not found
    }
}
exports.UniqueArray = UniqueArray;
