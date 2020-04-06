class Canvas {
	constructor(reference, states, style) {
		this.reference = reference;
		this.states = states;
		this.style = style;

		this.context = reference.getContext("2d");
		this.pinList = [];
		this.visitedNode = [];
		this.shortestPath = [];
	}
	drawGrid() {
		for (let i = 0; i <= this.style.width; i++) {
			i += 10;
			this.context.strokeStyle = "#ccc";
			this.context.beginPath();
			this.context.moveTo(0, i);
			this.context.lineTo(this.style.width, i);
			this.context.stroke();
		}
		for (let i = 0; i <= this.style.height; i++) {
			i += 10;
			this.context.beginPath();
			this.context.moveTo(i, 0);
			this.context.lineTo(i, this.style.height);
			this.context.stroke();
		}
	}
	createNode() {
		for (let state in this.states) {
			let x = 0,
				y = 0;
			x = this.states[state]["coordinate"]["x"];
			y = this.states[state]["coordinate"]["y"];
			this.drawCircle({ x, y, state, radius: this.style.nodeRadius, color: this.style.nodeColor });
			this.write({ state, x, y, color: this.style.nodeColor });
		}
	}
	createEdge(startingNode) {
		/* createEdge will perform breadth first search 
    to reach out all nodes and form edge between them
    */

		let [visitedNodeList, queue] = [[], []];

		queue.push(startingNode);
		visitedNodeList[startingNode] = true;

		while (queue.length > 0) {
			let adjacentList = [];
			const queueElement = queue.shift();

			for (let adjacent in this.states[queueElement].adjacent) {
				adjacentList.push(adjacent);
			}

			for (let index in adjacentList) {
				let neighbor = adjacentList[index];

				this.drawLine({
					start: this.states[queueElement].coordinate,
					end: this.states[neighbor].coordinate,
					color: this.style.edgeColor,
					width: this.style.edgeWidth
				});

				if (!visitedNodeList[neighbor]) {
					visitedNodeList[neighbor] = true;
					queue.push(neighbor);
				}
			}
		}
	}
	drawCircle(dimension) {
		const startingAngle = 0,
			endingAngle = 2 * Math.PI;

		this.context.fillStyle = dimension.color;

		this.context.beginPath();
		this.context.arc(dimension.x, dimension.y, dimension.radius, startingAngle, endingAngle);
		this.context.fill();
	}
	drawLine(dimension) {
		this.context.lineWidth = dimension.width;
		this.context.strokeStyle = dimension.color;

		this.context.beginPath();
		this.context.moveTo(dimension.start.x, dimension.start.y);
		this.context.lineTo(dimension.end.x, dimension.end.y);
		this.context.stroke();
	}

	write(dimension) {
		this.context.strokeStyle = dimension.color;
		this.context.strokeText(dimension.state, dimension.x - 5, dimension.y - 10);
	}
	clicked(mouseX, mouseY) {
		for (let state in this.states) {
			let isNodeClicked = this.checkClick(mouseX, mouseY, state);
			if (isNodeClicked) {
				return this.pinSourceAndDestination(state);
				break;
			}
		}
		return false;
	}
	checkClick(mouseX, mouseY, state) {
		const radiusOfNode = 6;
		let maximumX = 0,
			maximumY = 0,
			minimumX = 0,
			minimumY = 0,
			distance = 0;

		let stateX = this.states[state].coordinate.x;
		let stateY = this.states[state].coordinate.y;

		maximumX = stateX + 6;
		maximumY = stateY + 6;
		minimumX = stateX - 6;
		minimumY = stateY - 6;

		if (mouseX <= maximumX && mouseX >= minimumX && mouseY <= maximumY && mouseY >= minimumY) {
			distance = this.calculateDistance(stateX, stateY, mouseX, mouseY);
			if (distance <= radiusOfNode) {
				return true;
			}
		}
		return false;
	}
	calculateDistance(x1, y1, x2, y2) {
		const a = x2 - x1;
		const b = y2 - y1;
		return Math.sqrt(a * a - b * b);
	}
	pinSourceAndDestination(node) {
		if (this.pinList.length < 2) {
			this.pinList.push(node);
			this.drawCircle({
				x: this.states[node].coordinate.x,
				y: this.states[node].coordinate.y,
				radius: this.style.nodeRadius,
				color: this.style.pinNodeColor
			});
			if (this.pinList.length === 2) {
				return true;
			}
		} else {
			this.drawCircle({
				x: this.states[this.pinList[0]].coordinate.x,
				y: this.states[this.pinList[0]].coordinate.y,
				radius: this.style.nodeRadius,
				color: this.style.pinNodeColor
			});
			this.pinList.shift();
			this.pinList.push(node);
			this.drawCircle({
				x: this.states[node].coordinate.x,
				y: this.states[node].coordinate.y,
				radius: this.style.nodeRadius,
				color: "black"
			});
			return true;
		}
		return false;
	}
	visualize(visitedNode, shortestPath) {
		this.visitedNode = visitedNode;
		this.shortestPath = shortestPath;
		this.displayVisitedNode();
	}
	displayVisitedNode() {
		let index = 0;
		let interval = setInterval(() => {
			let start = null;
			if (index < this.visitedNode.length) {
				start = {
					x: this.states[this.visitedNode[index]].coordinate.x,
					y: this.states[this.visitedNode[index]].coordinate.y
				};
				this.drawCircle({
					x: start.x,
					y: start.y,
					radius: this.style.nodeRadius,
					color: this.style.visitedNodeColor
				});
				index++;
			} else {
				clearInterval(interval);
				this.displayShortestPath();
			}
		}, 500);
	}
	displayShortestPath() {
		this.shortestPath.forEach((state, index) => {
			let [start, end, secondState] = [null];
			secondState = this.shortestPath[index + 1];
			start = {
				x: this.states[state].coordinate.x,
				y: this.states[state].coordinate.y
			};

			this.drawCircle({
				x: start.x,
				y: start.y,
				radius: this.style.nodeRadius,
				color: this.style.pathColor
			});

			if (index !== this.shortestPath.length - 1) {
				end = {
					x: this.states[secondState].coordinate.x,
					y: this.states[secondState].coordinate.y
				};
				this.drawLine({
					start,
					end,
					color: this.style.pathColor,
					width: this.style.pathWidth
				});
			}
		});
	}
}

export default Canvas;
