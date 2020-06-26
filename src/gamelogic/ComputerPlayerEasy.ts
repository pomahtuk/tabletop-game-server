import ComputerPlayer, { ComputerPlayerType } from "./ComputerPlayer";
import { v4 as uuid } from "uuid";

class ComputerPlayerEasy extends ComputerPlayer {
  protected minimumShips = 20;
  protected shipCountFactor = 2;

  constructor(id: string = uuid(), name: string) {
    super(id, name, ComputerPlayerType.EASY);
  }
}

export default ComputerPlayerEasy;
