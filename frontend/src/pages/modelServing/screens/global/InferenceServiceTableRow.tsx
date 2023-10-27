import * as React from 'react';
import { DropdownDirection } from '@patternfly/react-core';
import { ActionsColumn, Td } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import ResourceNameTooltip from '~/components/ResourceNameTooltip';
import { isModelMesh } from '~/pages/modelServing/utils';
import useModelMetricsEnabled from '~/pages/modelServing/useModelMetricsEnabled';
import { InferenceServiceKind, ServingRuntimeKind } from '~/k8sTypes';
import { getInferenceServiceDisplayName } from './utils';
import InferenceServiceEndpoint from './InferenceServiceEndpoint';
import InferenceServiceProject from './InferenceServiceProject';
import InferenceServiceStatus from './InferenceServiceStatus';
import InferenceServiceServingRuntime from './InferenceServiceServingRuntime';

type InferenceServiceTableRowProps = {
  obj: InferenceServiceKind;
  isGlobal: boolean;
  servingRuntime?: ServingRuntimeKind;
  onDeleteInferenceService: (obj: InferenceServiceKind) => void;
  onEditInferenceService: (obj: InferenceServiceKind) => void;
  showServingRuntime?: boolean;
};

const InferenceServiceTableRow: React.FC<InferenceServiceTableRowProps> = ({
  obj: inferenceService,
  servingRuntime,
  onDeleteInferenceService,
  onEditInferenceService,
  isGlobal,
  showServingRuntime,
}) => {
  const [modelMetricsEnabled] = useModelMetricsEnabled();

  return (
    <>
      <Td dataLabel="Name">
        <ResourceNameTooltip resource={inferenceService}>
          {modelMetricsEnabled ? (
            <Link
              to={
                isGlobal
                  ? `/modelServing/metrics/${inferenceService.metadata.namespace}/${inferenceService.metadata.name}`
                  : `/projects/${inferenceService.metadata.namespace}/metrics/model/${inferenceService.metadata.name}`
              }
            >
              {getInferenceServiceDisplayName(inferenceService)}
            </Link>
          ) : (
            getInferenceServiceDisplayName(inferenceService)
          )}
        </ResourceNameTooltip>
      </Td>
      {isGlobal && (
        <Td dataLabel="Project">
          <InferenceServiceProject inferenceService={inferenceService} />
        </Td>
      )}
      {showServingRuntime && (
        <Td dataLabel="Serving Runtime">
          <InferenceServiceServingRuntime servingRuntime={servingRuntime} />
        </Td>
      )}
      <Td dataLabel="Inference endpoint">
        <InferenceServiceEndpoint
          inferenceService={inferenceService}
          servingRuntime={servingRuntime}
        />
      </Td>
      <Td dataLabel="Status">
        <InferenceServiceStatus inferenceService={inferenceService} />
      </Td>
      <Td isActionCell>
        <ActionsColumn
          dropdownDirection={isGlobal ? DropdownDirection.down : DropdownDirection.up}
          items={[
            {
              // TODO re-enable edit when supported
              isDisabled: !isModelMesh(inferenceService),
              title: 'Edit',
              onClick: () => {
                onEditInferenceService(inferenceService);
              },
            },
            {
              title: 'Delete',
              onClick: () => {
                onDeleteInferenceService(inferenceService);
              },
            },
          ]}
        />
      </Td>
    </>
  );
};

export default InferenceServiceTableRow;
