export const Status = {
  Open: Symbol('Open'),
  Closed: Symbol('Closed'),
}

export const Phase = {
  Invalid: Symbol('Invalid'),
  Adjudicating: Symbol('Adjudicating'),
  Ruled: Symbol('Ruled'),
  Evidence: Symbol('Evidence submission'),
  JuryDrafting: Symbol('Jury drafting'),
  VotingPeriod: Symbol('Voting period'),
  AppealRuling: Symbol('Appealing'),
  ConfirmAppeal: Symbol('ConfirmingAppeal'),
  ClaimRewards: Symbol('Claim rewards'),
}

const stringMapping = {
  [Status.Open]: 'Open',
  [Status.Closed]: 'Closed',
  [Phase.Evidence]: 'Evidence submission',
  [Phase.JuryDrafting]: 'Jury drafting',
  [Phase.VotingPeriod]: 'Voting period',
  [Phase.AppealRuling]: 'Appeal ruling',
  [Phase.ConfirmAppeal]: 'Confirm appeal',
  [Phase.ClaimRewards]: 'Claim rewards',
  [Phase.Invalid]: 'Invalid',
}

const symbolMapping = {
  Invalid: Phase.Invalid,
  Committing: Phase.VotingPeriod,
  Drafting: Phase.JuryDrafting,
  Adjudicating: Phase.Adjudicating,
  Ruled: Phase.Ruled,
  Evidence: Phase.Evidence,
}

export function convertFromString(str) {
  return symbolMapping[str]
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}