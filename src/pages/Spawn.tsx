import { useParams, Link, Route, Routes, Navigate } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import {
  PageWrapper,
  SideNav,
  SideNavGroup,
  SideNavItem,
} from "components/styles";
import { routes, SpawnTab } from "constants/routes";
import { SpawnHost } from "./spawn/SpawnHost";
import { SpawnVolume } from "./spawn/SpawnVolume";

export const Spawn: React.VFC = () => {
  const { tab } = useParams<{ tab: string }>();
  const spawnAnalytics = useSpawnAnalytics();

  return (
    <>
      <SideNav aria-label="Hosts & Volumes">
        <SideNavGroup header="Hosts & Volumes">
          <SideNavItem
            active={tab === SpawnTab.Host}
            to={routes.spawnHost}
            as={Link}
            data-cy="host-nav-tab"
            onClick={() =>
              spawnAnalytics.sendEvent({
                name: "Change Tab",
                tab: SpawnTab.Host,
              })
            }
          >
            Hosts
          </SideNavItem>
          <SideNavItem
            active={tab === SpawnTab.Volume}
            to={routes.spawnVolume}
            as={Link}
            data-cy="volume-nav-tab"
            onClick={() =>
              spawnAnalytics.sendEvent({
                name: "Change Tab",
                tab: SpawnTab.Volume,
              })
            }
          >
            Volumes
          </SideNavItem>
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        <Routes>
          <Route path={SpawnTab.Host} element={<SpawnHost />} />
          <Route path={SpawnTab.Volume} element={<SpawnVolume />} />
          <Route path="*" element={<Navigate to={SpawnTab.Host} replace />} />
        </Routes>
      </PageWrapper>
    </>
  );
};
