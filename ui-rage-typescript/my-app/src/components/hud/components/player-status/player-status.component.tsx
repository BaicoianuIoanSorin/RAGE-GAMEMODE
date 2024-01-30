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

  let rpc: any = null;
  if ("rpc" in window && "callClient" in window.rpc) {
    rpc = window.rpc;
  }

  if(rpc) {
    rpc.register(
      ThirstyHungerEvents.CEF_GET_HUNGRY_AND_THIRSTY_LEVEL,
      (thirstyHungryLevelJSON: string) => {
        const thirstyHungryLevel: ThirstyHungerLevelModel =
          JSON.parse(thirstyHungryLevelJSON);
        setThirstyAndHungryLevel(thirstyHungryLevel);
      }
    );
  }

  useEffect(() => {
    // when initializing
    if(rpc) {
      rpc
      .callServer(ThirstyHungerEvents.SERVER_GET_HUNGRY_AND_THIRSTY_LEVEL)
      .then((thirstHungerLevel: ThirstyHungerLevelModel) => {
        setThirstyAndHungryLevel(thirstHungerLevel);
      });
    }
  }, []);

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
