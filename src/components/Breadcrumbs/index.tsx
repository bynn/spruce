import { Fragment } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import Icon from "components/Icon";
import { StyledRouterLink } from "components/styles";
import { size } from "constants/tokens";
import { trimStringFromMiddle } from "utils/string";

const { gray } = palette;

export interface Breadcrumb {
  text: string;
  to?: string;
  onClick?: () => void;
}
interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}
const Breadcrumbs: React.VFC<BreadcrumbsProps> = ({ breadcrumbs }) => (
  <Container>
    {breadcrumbs.map((bc, index) => (
      <Fragment key={`breadCrumb-${bc.text}`}>
        <BreadcrumbFragment breadcrumb={bc} />
        {breadcrumbs.length - 1 !== index && (
          <PaddedIcon
            data-cy="breadcrumb-chevron"
            glyph="ChevronRight"
            fill={gray.dark2}
            size="small"
          />
        )}
      </Fragment>
    ))}
  </Container>
);

interface BreadcrumbFragmentProps {
  breadcrumb: Breadcrumb;
}
const BreadcrumbFragment: React.VFC<BreadcrumbFragmentProps> = ({
  breadcrumb,
}) => {
  const { text = "", to, onClick, ...rest } = breadcrumb;
  const shouldTrimMessage = text.length > 30;
  const message = trimStringFromMiddle(text, 30);
  return (
    <ConditionalWrapper
      condition={shouldTrimMessage}
      wrapper={(children) => (
        <Tooltip
          align="top"
          justify="middle"
          trigger={children}
          triggerEvent="hover"
          data-cy="breadcrumb-tooltip"
        >
          {text}
        </Tooltip>
      )}
    >
      {to ? (
        <Body {...rest}>
          <StyledRouterLink to={to} onClick={onClick}>
            {message}
          </StyledRouterLink>
        </Body>
      ) : (
        <Body {...rest}>{message}</Body>
      )}
    </ConditionalWrapper>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  margin-bottom: ${size.m};
`;

const PaddedIcon = styled(Icon)`
  margin: 0 ${size.xxs};
`;

export default Breadcrumbs;
