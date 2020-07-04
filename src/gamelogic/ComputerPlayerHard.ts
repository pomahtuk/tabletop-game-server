import ComputerPlayer, { ComputerPlayerType } from "./ComputerPlayer";
import { v4 as uuid } from "uuid";

class ComputerPlayerHard extends ComputerPlayer {
  public minimumShips = 30;
  public shipCountFactor = 3;

  constructor(id: string = `computer_${uuid()}`, name: string) {
    super(id, name, ComputerPlayerType.HARD);
  }
}

export default ComputerPlayerHard;
