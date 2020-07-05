const alphabetSize = 26;

const getPlanetLimit = (fieldSize: number, playerCount: number): number => {
  const densityRatio = 0.2;
  // it make sense to space things out
  return Math.min(
    Math.ceil(fieldSize * densityRatio) - playerCount,
    alphabetSize - playerCount
  );
};

export default getPlanetLimit;
