import styled from "@emotion/styled";
import { SiderCard } from "components/styles";
import { size } from "constants/tokens";
import { MyHost, TableVolume } from "types/spawn";

const FieldContainer = styled.div`
  display: flex;
  width: 100%;
  margin: ${size.xs};
`;

const FieldName = styled.div`
  min-width: 150px;
`;

interface CardItem {
  label: string;
  value: JSX.Element;
}

const CardField: React.VFC<CardItem> = ({ label, value }) =>
  value !== undefined && (
    <FieldContainer>
      <FieldName>{label}</FieldName>
      <div>{value}</div>
    </FieldContainer>
  );

type FieldMap<T> = {
  [key: string]: (T: T) => JSX.Element;
};

interface DetailsCardProps {
  type: MyHost | TableVolume;
  ["data-cy"]?: string;
  fieldMaps: FieldMap<MyHost | TableVolume>;
}

export const DetailsCard: React.VFC<DetailsCardProps> = ({
  type,
  "data-cy": dataCy,
  fieldMaps,
}) => (
  <CardContainer data-cy={dataCy}>
    {Object.keys(fieldMaps).map((key) => (
      <CardField
        key={`${key}_${type.id}`}
        label={key}
        value={fieldMaps[key](type)}
      />
    ))}
  </CardContainer>
);

const CardContainer = styled(SiderCard)`
  width: 80%;
  padding: ${size.s} ${size.l};
`;
