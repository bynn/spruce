import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { useSpawnAnalytics } from "analytics";
import { PlusButton } from "components/Buttons";
import { size } from "constants/tokens";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { GET_MY_HOSTS } from "gql/queries";
import { useSpruceConfig } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { HostStatus } from "types/host";
import { QueryParams } from "../types";
import { SpawnHostModal } from "./spawnHostButton/SpawnHostModal";

export const SpawnHostButton: React.VFC = () => {
  const { data: myHostsData } = useQuery<MyHostsQuery, MyHostsQueryVariables>(
    GET_MY_HOSTS
  );
  const [spawnHostParam, setSpawnHostParam] = useQueryParam<
    boolean | undefined
  >(QueryParams.SpawnHost, false);

  const spruceConfig = useSpruceConfig();

  const [openModal, setOpenModal] = useState(spawnHostParam);
  const spawnAnalytics = useSpawnAnalytics();

  const maxHosts = spruceConfig?.spawnHost?.spawnHostsPerUser || 0;

  const nonTerminatedHosts = myHostsData?.myHosts.filter(
    (host) => host.status !== HostStatus.Terminated
  );
  const currentHostCount = nonTerminatedHosts?.length || 0;
  const reachedMaxNumHosts = currentHostCount >= maxHosts;

  return (
    <PaddedContainer>
      <Tooltip
        align="top"
        justify="middle"
        triggerEvent="hover"
        trigger={
          <PlusButton
            disabled={reachedMaxNumHosts}
            onClick={() => {
              setOpenModal(true);
              spawnAnalytics.sendEvent({
                name: "Opened the Spawn Host Modal",
              });
            }}
            data-cy="spawn-host-button"
          >
            Spawn a host
          </PlusButton>
        }
        enabled={reachedMaxNumHosts}
      >
        {`You have reached the maximum number of hosts (${maxHosts}). Delete some hosts to spawn more.`}
      </Tooltip>
      {openModal && (
        <SpawnHostModal
          open={openModal}
          setOpen={(open) => {
            setOpenModal(open);
            setSpawnHostParam(undefined);
          }}
        />
      )}
    </PaddedContainer>
  );
};

const PaddedContainer = styled.div`
  padding: ${size.l} 0;
`;
