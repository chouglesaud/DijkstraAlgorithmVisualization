import states from "../data/graph.json";
import Canvas from "./canvas";
import Dijkstra from "./dijkstra";

const domElement = document.querySelector("canvas");
const clear = document.querySelector("button");
const startingNode = "kashmir";

const style = {
	width: 700,
	height: 700,
	nodeColor: "white",
	visitedNodeColor: "black",
	nodeRadius: 6,
	edgeColor: "white",
	edgeWidth: 1,
	pathColor: "blue",
	pathWidth: 2.5,
	pinNodeColor: "green"
};

const canvas = new Canvas(domElement, states, style);

canvas.createNode();
canvas.createEdge(startingNode);

canvas.reference.addEventListener("click", e => {
	let mouseX = e.offsetX;
	let mouseY = e.offsetY;
	let clicked = canvas.clicked(mouseX, mouseY);

	if (clicked) {
		let source = canvas.pinList[0],
			destination = canvas.pinList[1];

		let dijkstra = new Dijkstra(source, destination);
		let { shortestPath, visitedNode } = dijkstra.getShortestPath();

		canvas.visualize(visitedNode, shortestPath);
	}
});

clear.addEventListener("click", () => {
	window.location.reload();
});
