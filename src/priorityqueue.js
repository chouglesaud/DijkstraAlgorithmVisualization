export default class PriorityQueue {
	constructor(node) {
		this.list = [];
	}
	enqueue(node, cost) {
		this.list.push({ node, cost });
		this.sort();
	}
	dequeue() {
		return this.list.shift();
	}
	sort() {
		this.list.sort((a, b) => a.cost - b.cost);
	}
}
