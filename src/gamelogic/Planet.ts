import randomColor from "randomcolor";

import Player from "./Player";
import { User } from "../dao/entities/user";

export interface PlanetCoordinates {
  x: number;
  y: number;
}

export const produceFleets = (planet: Planet) => {
  if (planet.owner) {
    planet.ships += planet.production;
    // increase produced ship count
    planet.owner.stats!.shipCount += planet.production;
  }
};

export default class Planet {
  public name: string;
  public owner: Player | User | null = null; // reference co playerId
  public ships: number;
  public shipsDue: number = 0; // only if there are ships en route
  public production: number; // only happens when planet is taken, next turn
  public killPercent: number;
  // Kill percent is a measure of the effectiveness of the ships produced at that planet.
  // Attack fleets take the kill percentage of their planet of departure,
  // and defense fleets use the kill percentage of the planet they are defending.
  public coordinates: PlanetCoordinates;
  public mainColor: string;

  public constructor(
    name: string,
    player?: Player | User | null,
    coordinates: PlanetCoordinates = { x: 0, y: 0 }
  ) {
    // initialize
    this.name = name;
    this.coordinates = coordinates;

    let production = 10;
    let killPercent = 0.5;
    if (!player) {
      production = 5 + Math.floor(Math.random() * 10); // 5-15 as in original
      this.ships = production;
      killPercent = Number((0.3 + Math.random() * 0.6).toFixed(1)); //  0.30 - 0.90
    } else {
      this.owner = player;
      this.ships = production;
    }

    this.production = production;
    this.killPercent = killPercent;
    this.mainColor = randomColor({ luminosity: "dark" });
  }
}

export interface PlanetMap {
  [key: string]: Planet;
}
