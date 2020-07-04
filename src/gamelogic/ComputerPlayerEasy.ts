import ComputerPlayer, { ComputerPlayerType } from "./ComputerPlayer";
import { v4 as uuid } from "uuid";

class ComputerPlayerEasy extends ComputerPlayer {
  public minimumShips = 20;
  public shipCountFactor = 2;

  constructor(id: string = `computer_${uuid()}`, name: string) {
    super(id, name, ComputerPlayerType.EASY);
  }
}

export default ComputerPlayerEasy;
