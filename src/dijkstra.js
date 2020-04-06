import states from "../data/graph.json";
import PriorityQueue from "./priorityqueue";

class Dijkstra {
	constructor(source, destination) {
		this.source = source;
		this.destination = destination;
		this.adjacencyList = states;
		this.costFromSource = new Map();
		this.previousNodeList = new Map();
		this.unvisitedNode = new PriorityQueue();
		this.visitedNode = [];
		this.result = [];
		this.current;
	}
	initialization() {
		for (let node in this.adjacencyList) {
			if (node === this.source) {
				this.costFromSource[node] = 0;
				this.unvisitedNode.enqueue(node, 0);
			} else {
				this.costFromSource[node] = Infinity;
			}
			this.previousNodeList[node] = null;
		}
	}
	getShortestPath() {
		this.initialization();
		while (this.unvisitedNode.list.length) {
			this.current = this.unvisitedNode.dequeue().node;
			this.visitedNode.push(this.current);

			if (this.current === this.destination) {
				while (this.previousNodeList[this.current]) {
					this.result.push(this.current);
					this.current = this.previousNodeList[this.current];
				}
				break;
			} else {
				for (let adjacent in this.adjacencyList[this.current]["adjacent"]) {
					let costToAdjacent = this.costFromSource[this.current] + this.adjacencyList[this.current]["adjacent"][adjacent];
					if (costToAdjacent < this.costFromSource[adjacent]) {
						this.costFromSource[adjacent] = costToAdjacent;
						this.previousNodeList[adjacent] = this.current;
						this.unvisitedNode.enqueue(adjacent, costToAdjacent);
					}
				}
			}
		}
		return { shortestPath: this.result.concat(this.current).reverse(), visitedNode: this.visitedNode };
	}
}

export default Dijkstra;
