export function weightedRandomChoice(playerIds, weights) {
  const totalWeight = playerIds.reduce(
    (sum, id) => sum + (weights[id] || 1),
    0
  );
  let random = Math.random() * totalWeight;

  for (const id of playerIds) {
    random -= weights[id] || 1;
    if (random <= 0) return id;
  }
}

export function chooseSpies(playerIds, spyCount, weights) {
  const chosen = new Set();

  while (chosen.size < spyCount && chosen.size < playerIds.length) {
    const spyId = weightedRandomChoice(playerIds, weights);
    chosen.add(spyId);
  }

  return Array.from(chosen);
}
