export const projectName = {
  schema: {
    type: "string" as "string",
    title: "Project Name",
    minLength: 1,
    format: "noSpaces",
  },
  uiSchema: {
    "ui:data-cy": "project-name-input",
  },
};

export const projectId = {
  schema: {
    type: "string" as "string",
    title: "Project ID",
    format: "noSpaces",
  },
  uiSchema: {
    "ui:data-cy": "project-id-input",
    "ui:description":
      "Project ID is used by Evergreen internally; it should only be user-specified with good reason, such as if the project will be using performance tooling. It cannot be changed!",
    "ui:optional": true,
  },
};

export const requestS3Creds = {
  schema: {
    type: "boolean" as "boolean",
    title:
      "Open a JIRA ticket for the Build team to add S3 credentials to the project",
    default: false,
  },
  uiSchema: {
    "ui:data-cy": "request-s3-creds",
  },
};
