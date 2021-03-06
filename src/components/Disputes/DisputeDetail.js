import React, { useCallback, useMemo } from 'react'
import { BackButton, Bar, Box, GU, SidePanel, Split } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import { utils as EthersUtils } from 'ethers'

import AppealPanel from './panels/AppealPanel'
import Banner from './PrecedenceCampaign/PrecedenceCampaignBanner'
import CommitPanel from './panels/CommitPanel'
import DisputeEvidences from './DisputeEvidences'
import DisputeInfo from './DisputeInfo'
import DisputeTimeline from './DisputeTimeline'
import MessageCard from '../MessageCard'
import NoEvidence from './NoEvidence'
import RevealPanel from './panels/RevealPanel'
import TitleHeader from '../TitleHeader'

import { Status as DisputeStatus } from '../../types/dispute-status-types'
import { useDisputeLogic, REQUEST_MODE } from '../../dispute-logic'
import { DisputeNotFound } from '../../errors'

import timelineErrorSvg from '../../assets/timelineError.svg'

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  const history = useHistory()
  const { id: disputeId } = match.params

  const {
    actions,
    error,
    dispute,
    disputeFetching,
    requestMode,
    panelState,
    requests,
  } = useDisputeLogic(disputeId)

  const evidenceList = dispute?.evidences

  const evidences = useMemo(
    () =>
      (evidenceList || []).map(evidence => ({
        ...evidence,
        createdAt: evidence.createdAt * 1000,
        data: EthersUtils.toUtf8String(evidence.data),
      })),
    [evidenceList]
  )

  const handleBack = useCallback(() => {
    history.push('/disputes')
  }, [history])

  const noDispute = !dispute && !disputeFetching

  if (noDispute && !error) {
    throw new DisputeNotFound(disputeId)
  }

  const DisputeInfoComponent = (
    <DisputeInfo
      id={disputeId}
      error={error}
      dispute={dispute}
      loading={disputeFetching}
      onDraft={actions.draft}
      onRequestCommit={requests.commit}
      onRequestReveal={requests.reveal}
      onLeak={actions.leak}
      onRequestAppeal={requests.appeal}
      onExecuteRuling={actions.executeRuling}
    />
  )

  return (
    <React.Fragment>
      {dispute?.marksPrecedent && <Banner disputeId={disputeId} />}
      <TitleHeader title="Disputes" />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>
      {dispute?.status === DisputeStatus.Voided ? (
        DisputeInfoComponent
      ) : (
        <Split
          primary={
            <React.Fragment>
              {DisputeInfoComponent}
              {(() => {
                if (disputeFetching || error?.fromGraph) {
                  return null
                }
                if (evidences.length === 0) {
                  return <NoEvidence />
                }
                return <DisputeEvidences evidences={evidences} />
              })()}
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Box
                heading="Dispute timeline"
                padding={error?.fromGraph ? 3 * GU : 0}
              >
                {(() => {
                  if (error?.fromGraph) {
                    return (
                      <MessageCard
                        title="We couldn’t load the dispute timeline"
                        paragraph="Something went wrong! Please restart the app."
                        icon={timelineErrorSvg}
                        mode="compact"
                        border={false}
                      />
                    )
                  }
                  if (disputeFetching) {
                    return <div css="height: 200px" />
                  }
                  return <DisputeTimeline dispute={dispute} />
                })()}
              </Box>
            </React.Fragment>
          }
        />
      )}
      <SidePanel
        title={<PanelTitle requestMode={requestMode} disputeId={disputeId} />}
        opened={panelState.visible}
        onClose={panelState.requestClose}
        onTransitionEnd={panelState.endTransition}
      >
        <div
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          <PanelComponent
            dispute={dispute}
            requestMode={requestMode}
            commit={actions.commit}
            reveal={actions.reveal}
            appeal={actions.appeal}
            confirmAppeal={actions.confirmAppeal}
            approveFeeDeposit={actions.approveFeeDeposit}
            onDone={panelState.requestClose}
          />
        </div>
      </SidePanel>
    </React.Fragment>
  )
})

const PanelTitle = ({ requestMode, disputeId }) => {
  const { mode, data } = requestMode

  if (mode === REQUEST_MODE.COMMIT)
    return <>Commit your vote on dispute #{disputeId}</>

  if (mode === REQUEST_MODE.REVEAL)
    return <>Reveal your vote on dispute #{disputeId}</>

  if (mode === REQUEST_MODE.APPEAL) {
    if (data.confirm) {
      return <>Confirm an appeal on dispute #{disputeId}</>
    }

    return <>Appeal ruling on dispute #{disputeId}</>
  }

  return null
}

const PanelComponent = ({
  appeal,
  approveFeeDeposit,
  commit,
  confirmAppeal,
  dispute,
  requestMode,
  reveal,
  ...props
}) => {
  const { mode, data } = requestMode

  if (mode === REQUEST_MODE.COMMIT) {
    return (
      <CommitPanel
        dispute={dispute}
        commitment={data.commitment}
        onCommit={commit}
        {...props}
      />
    )
  }

  if (mode === REQUEST_MODE.REVEAL) {
    return <RevealPanel dispute={dispute} onReveal={reveal} {...props} />
  }

  if (mode === REQUEST_MODE.APPEAL) {
    return (
      <AppealPanel
        dispute={dispute}
        onApproveFeeDeposit={approveFeeDeposit}
        onAppeal={data.confirm ? confirmAppeal : appeal}
        confirm={data.confirm}
        {...props}
      />
    )
  }

  return null
}

export default DisputeDetail
