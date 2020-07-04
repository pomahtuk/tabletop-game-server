import placePlanets, { Point } from "../../helpers/placePlanets";

import Planet, { PlanetMap } from "../../Planet";

const planets: PlanetMap = {
  A: new Planet("A", "1"),
  B: new Planet("B", "2"),
  C: new Planet("C", "3"),
  D: new Planet("D", "4"),
};

describe("placePlanets", (): void => {
  it("Able to place planets", (): void => {
    const fieldWidth = 3;
    const fieldHeight = 3;
    placePlanets({
      planets,
      fieldWidth,
      fieldHeight,
      planetCount: 4,
    });
  });

  it("Place planets so they do not collide with other planets coordinates", (): void => {
    const usedCoords: Point[] = Object.keys(planets)
      .map((planetName): Planet => planets[planetName])
      .reduce((acc: Point[], planet: Planet): Point[] => {
        const coords = planet.coordinates;
        const havePointAlready = !!acc.find(
          (point: Point): boolean =>
            point.x === coords.x && point.y === coords.y
        );
        expect(havePointAlready).toBe(false);
        acc.push(coords);
        return acc;
      }, []);

    expect(usedCoords.length).toBe(Object.keys(planets).length);
  });
});
