import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams, Link, Navigate } from "react-router-dom";
import { ProjectSelect } from "components/ProjectSelect";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  PageWrapper,
} from "components/styles";
import {
  ProjectSettingsTabRoutes,
  getProjectSettingsRoute,
} from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ProjectSettingsQuery,
  ProjectSettingsQueryVariables,
  RepoSettingsQuery,
  RepoSettingsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_SETTINGS, GET_REPO_SETTINGS } from "gql/queries";
import { usePageTitle } from "hooks";
import { validators } from "utils";
import { ProjectSettingsProvider } from "./projectSettings/Context";
import { CreateDuplicateProjectButton } from "./projectSettings/CreateDuplicateProjectButton";
import { getTabTitle } from "./projectSettings/getTabTitle";
import { ProjectSettingsTabs } from "./projectSettings/Tabs";
import { ProjectType } from "./projectSettings/tabs/utils";

const { validateObjectId } = validators;

export const ProjectSettings: React.VFC = () => {
  usePageTitle(`Project Settings`);
  const dispatchToast = useToastContext();
  const { projectIdentifier: identifier, tab } = useParams<{
    projectIdentifier: string;
    tab: ProjectSettingsTabRoutes;
  }>();

  // If the path includes an Object ID, this page represents a repo and we should not attempt to fetch a project.
  const isRepo = validateObjectId(identifier);

  const { data: projectData, loading: projectLoading } = useQuery<
    ProjectSettingsQuery,
    ProjectSettingsQueryVariables
  >(GET_PROJECT_SETTINGS, {
    skip: isRepo,
    variables: { identifier },
    onError: (e) => {
      dispatchToast.error(
        `There was an error loading the project ${identifier}: ${e.message}`
      );
    },
  });

  const repoId =
    projectData?.projectSettings?.projectRef?.repoRefId || identifier;

  // Assign project type in order to show/hide elements that should only appear for repos, attached projects, etc.
  let projectType;
  if (isRepo) {
    projectType = ProjectType.Repo;
  } else if (projectData?.projectSettings?.projectRef?.repoRefId) {
    projectType = ProjectType.AttachedProject;
  } else {
    projectType = ProjectType.Project;
  }

  const { data: repoData } = useQuery<
    RepoSettingsQuery,
    RepoSettingsQueryVariables
  >(GET_REPO_SETTINGS, {
    skip: projectLoading || projectType === ProjectType.Project,
    variables: { repoId },
    onError: (e) => {
      dispatchToast.error(`There was an error loading ${repoId}: ${e.message}`);
    },
  });

  if (!tabRouteValues.includes(tab)) {
    return (
      <Navigate
        to={getProjectSettingsRoute(
          identifier,
          ProjectSettingsTabRoutes.General
        )}
      />
    );
  }

  const sharedProps = {
    identifier,
    currentTab: tab,
  };

  const project =
    projectType === ProjectType.Repo
      ? repoData?.repoSettings
      : projectData?.projectSettings;

  const owner = project?.projectRef?.owner;
  const repo = project?.projectRef?.repo;

  // If current project is a repo, use "owner/repo" since repos lack identifiers
  const projectLabel =
    projectType === ProjectType.Repo ? `${owner}/${repo}` : identifier;

  return (
    <ProjectSettingsProvider>
      <SideNav aria-label="Project Settings" widthOverride={250}>
        <ButtonsContainer>
          <ProjectSelect
            selectedProjectIdentifier={projectLabel}
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
          <CreateDuplicateProjectButton
            id={project?.projectRef?.id}
            label={projectLabel}
            owner={owner}
            projectType={projectType}
            repo={repo}
          />
        </ButtonsContainer>

        <SideNavGroup>
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.General}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Access}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Variables}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.GithubCommitQueue}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Notifications}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.PatchAliases}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.VirtualWorkstation}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.ProjectTriggers}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.PeriodicBuilds}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.Plugins}
          />
          <ProjectSettingsNavItem
            {...sharedProps}
            tab={ProjectSettingsTabRoutes.EventLog}
          />
        </SideNavGroup>
      </SideNav>
      <PageWrapper>
        {project ? (
          <ProjectSettingsTabs
            projectData={projectData?.projectSettings}
            projectType={projectType}
            repoData={repoData?.repoSettings}
          />
        ) : (
          <Skeleton />
        )}
      </PageWrapper>
    </ProjectSettingsProvider>
  );
};

const ProjectSettingsNavItem: React.VFC<{
  currentTab: ProjectSettingsTabRoutes;
  identifier: string;
  tab: ProjectSettingsTabRoutes;
  title?: string;
}> = ({ currentTab, identifier, tab, title }) => (
  <SideNavItem
    active={tab === currentTab}
    as={Link}
    to={getProjectSettingsRoute(identifier, tab)}
    data-cy={`navitem-${tab}`}
  >
    {title || getTabTitle(tab).title}
  </SideNavItem>
);

const tabRouteValues = Object.values(ProjectSettingsTabRoutes);

const ButtonsContainer = styled.div`
  margin: 0 ${size.s};

  > :not(:last-child) {
    margin-bottom: ${size.xs};
  }
`;
