const data = require('./data.js');
const flights = data.flights;
function cheapestFlight(start, end, flights) {
  // Create a map to store the cheapest cost to reach each node
  const cheapestCosts = new Map([[start, 0]]);
  // Create a map to store the parent of each node in the cheapest path
  const parents = new Map([[start, null]]);
  // Create a priority queue to store nodes to be visited, ordered by cheapest cost
  const queue = [[0, start]];

  while (queue.length > 0) {
    // Get the node with the cheapest cost
    const [cost, node] = queue.shift();

    // If we've reached the end node, return the cheapest cost and path
    if (node === end) {
      const path = [end];
      let parent = parents.get(end);
      while (parent !== null) {
        path.push(parent);
        parent = parents.get(parent);
      }
      return [cost, path.reverse()];
    }

    // Check each neighbor of the current node
    for (const [neighbor, neighborCost] of Object.entries(flights[node] || {})) {
      // Calculate the cost to reach the neighbor
      const totalCost = cost + neighborCost;
      // If this is the cheapest cost to reach the neighbor so far, update the maps and queue
      if (!cheapestCosts.has(neighbor) || totalCost < cheapestCosts.get(neighbor)) {
        cheapestCosts.set(neighbor, totalCost);
        parents.set(neighbor, node);
        queue.push([totalCost, neighbor]);
      }
    }
    queue.sort((a, b) => a[0] - b[0]);
  }

  // If we've searched all reachable nodes and haven't found the end node, there is no path
  return [Infinity, []];
}

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bengaluru', 'Hyderabad', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Pune'];

const [cost, path] = cheapestFlight('Lucknow', 'Chennai', flights);
console.log(`The cheapest flight from A to D costs ${cost} and takes the following path: ${path}`);
