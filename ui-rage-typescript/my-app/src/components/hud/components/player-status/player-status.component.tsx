import "./player-status.component.scss";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { GiWaterBottle } from "react-icons/gi";
import { GiHamburger } from "react-icons/gi";

export const PlayerStatusComponent: React.FC = () => {
  return (
    <div className="player-status">
      <CircularProgress className="thirsty" value={80} color="blue.400">
        <CircularProgressLabel>
          <Icon as={GiWaterBottle} w={19} h={19} color="blue.400"/>
        </CircularProgressLabel>
      </CircularProgress>
      <CircularProgress className="hunger" value={80} color="orange.400">
        <CircularProgressLabel>
          <Icon as={GiHamburger} w={19} h={19} color="orange.400"/>
        </CircularProgressLabel>
      </CircularProgress>
    </div>
  );
};
