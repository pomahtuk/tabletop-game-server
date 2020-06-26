import ComputerPlayer, { ComputerPlayerType } from "./ComputerPlayer";
import { v4 as uuid } from "uuid";

class ComputerPlayerHard extends ComputerPlayer {
  protected minimumShips = 30;
  protected shipCountFactor = 3;

  constructor(id: string = uuid(), name: string) {
    super(id, name, ComputerPlayerType.HARD);
  }
}

export default ComputerPlayerHard;
