import ComputerPlayer, { ComputerPlayerType } from "./ComputerPlayer";
import { v4 as uuid } from "uuid";

class ComputerPlayerNormal extends ComputerPlayer {
  protected minimumShips = 10;
  protected shipCountFactor = 2;

  constructor(id: string = uuid(), name: string) {
    super(id, name, ComputerPlayerType.NORMAL);
  }
}

export default ComputerPlayerNormal;
