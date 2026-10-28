export interface ShowcaseItem {
	name: string;
	href?: string;
	stack: string;
	badge?: string;
	desc: string;
}

export const showcase: ShowcaseItem[] = [
  {
    name: `Explainable Machine Learning for Portfolio Rebalancing
      (Undergraduate Research Opportunities Programme)`,
    desc: `Investigating inherently interpretable machine learning models for
      stock return forecasting and dynamic portfolio rebalancing, comparing
  predictive performance, risk-adjusted returns, and explainability against
  black-box approaches.`,
    stack: "Python · PyTorch · Financial ML",
    badge: "Ongoing Research",
  }
];
