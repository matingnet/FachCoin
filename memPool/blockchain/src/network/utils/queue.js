class Queue {
    constructor() {
        this.items = [];
    }

    // Add item to the end of the queue
    enqueue(item) {
        if (Array.isArray(item)) {
            // If item is an array, add each element to the queue individually
            item.forEach(element => this.items.push(element));
        } else {
            // Otherwise, add the single item directly
            this.items.push(item);
        }
    }
    

    // Remove item from the front of the queue
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.items.shift();
    }

    // Get the item at the front of the queue without removing it
    peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.items[0];
    }

    // Check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size() {
        return this.items.length;
    }
}



module.exports = Queue ; 