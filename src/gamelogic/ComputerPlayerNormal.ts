import ComputerPlayer, { ComputerPlayerType } from "./ComputerPlayer";
import { v4 as uuid } from "uuid";

class ComputerPlayerNormal extends ComputerPlayer {
  public minimumShips = 10;
  public shipCountFactor = 2;

  constructor(id: string = `computer_${uuid()}`, name: string) {
    super(id, name, ComputerPlayerType.NORMAL);
  }
}

export default ComputerPlayerNormal;
