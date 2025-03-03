import { UpdateVolumeMutationVariables } from "gql/generated/types";
import { TableVolume } from "types/spawn";

type Action =
  | { type: "editExpiration"; expiration?: Date; noExpiration?: boolean }
  | { type: "setDisplayName"; name: string }
  | {
      type: "reset";
      volume: UpdateVolumeMutationVariables["UpdateVolumeInput"];
    };

export const getInitialState = (volume: TableVolume) => ({
  expiration: new Date(volume.expiration),
  volumeId: volume.id,
  noExpiration: volume.noExpiration,
  name: volume.displayName,
});

export function reducer(
  state: UpdateVolumeMutationVariables["UpdateVolumeInput"],
  action: Action
) {
  switch (action.type) {
    case "editExpiration":
      return {
        ...state,
        expiration:
          action.expiration !== undefined
            ? action.expiration
            : state.expiration,
        noExpiration:
          action.noExpiration !== undefined
            ? action.noExpiration
            : state.noExpiration,
      };
    case "setDisplayName":
      return {
        ...state,
        name: action.name,
      };
    case "reset":
      return {
        ...action.volume,
      };
    default:
      throw new Error("Unknown action type");
  }
}
