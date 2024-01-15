import "./player-status.component.scss";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { GiWaterBottle } from "react-icons/gi";
import { GiHamburger } from "react-icons/gi";
import { ThirstyHungerLevelModel } from "../../../../utils/thursty-hunger/model";
import { useEffect, useState } from "react";
import { ThirstyHungerEvents } from "../../../../utils/thursty-hunger/events.constants";

export const PlayerStatusComponent: React.FC = () => {
  const [thirstyAndHungryLevel, setThirstyAndHungryLevel] =
    useState<ThirstyHungerLevelModel>({ thirstyLevel: 0, hungryLevel: 0 });
  const [justInitialized, setJustInitialized] = useState<boolean>(true);

  const runTimer: number = 3 * 60 * 1000; // 3 minutes

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  // this one updates the thirsty and hungry levels every 5 minutes
  useEffect(() => {
    if (justInitialized) {
      rpc
        .callServer(ThirstyHungerEvents.SERVER_GET_HUNGRY_AND_THIRSTY_LEVEL)
        .then((thirstHungerLevel: ThirstyHungerLevelModel) => {
          setThirstyAndHungryLevel(thirstHungerLevel);
        });
      setJustInitialized(false);
      return;
    } else {
      let timerForGettingThirstyHungryLevel = setTimeout(async () => {
        const thirstHungerLevel: ThirstyHungerLevelModel = await rpc.callServer(
          ThirstyHungerEvents.SERVER_GET_HUNGRY_AND_THIRSTY_LEVEL
        );
        setThirstyAndHungryLevel(thirstHungerLevel);
      }, runTimer);
      return () => {
        clearTimeout(timerForGettingThirstyHungryLevel);
      };
    }
  }, [thirstyAndHungryLevel]);

  return (
    <div className="player-status">
      <CircularProgress
        className="thirsty"
        value={thirstyAndHungryLevel.thirstyLevel}
        color="blue.400"
      >
        <CircularProgressLabel>
          <Icon as={GiWaterBottle} w={19} h={19} color="blue.400" />
        </CircularProgressLabel>
      </CircularProgress>
      <CircularProgress
        className="hunger"
        value={thirstyAndHungryLevel.hungryLevel}
        color="orange.400"
      >
        <CircularProgressLabel>
          <Icon as={GiHamburger} w={19} h={19} color="orange.400" />
        </CircularProgressLabel>
      </CircularProgress>
    </div>
  );
};
