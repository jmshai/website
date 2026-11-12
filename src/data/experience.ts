export type TimelineKind = "work" | "study" | "research";

export interface TimelineEntry {
	kind: TimelineKind;
	org: string;
	role: string;
	/** "YYYY-MM". */
	from: string;
	/** "YYYY-MM"; omit if ongoing with no end date. */
	to?: string;
	/** Show "(expected)" after the end date. */
	expected?: boolean;
	location?: string;
	summary?: string;
	stack?: string[];
}

/*
 * Sample entry (copy it into the array below and edit). Order doesn't matter:
 * the page sorts by `from`, newest first.
 *
 * {
 * 	kind: "work",                 // "work" | "research" → right column, "study" → left column
 * 	org: "Company Name",
 * 	role: "Your Title",
 * 	from: "2027-06",              // "YYYY-MM", zero-padded
 * 	to: "2027-12",                // omit while ongoing → shows "present"
 * 	expected: true,               // optional; adds "(expected)" after the end date (handy for degrees)
 * 	location: "Singapore",        // optional
 * 	summary: "One or two sentences on what you did.", // optional
 * 	stack: ["Python", "Docker"],  // optional; omit to hide the tools line
 * },
 */
export const timeline: TimelineEntry[] = [
	{
		kind: "research",
		org: "National University of Singapore",
		role: "REx Fellow (UROPS), supervised by Prof. Cao Qi",
		from: "2026-08",
		location: "Singapore",
		summary:
			"Building an interpretable ML framework for dynamic portfolio rebalancing on 20 years of equity data: LSTM price prediction and DQN agents, evaluated on Sharpe ratio and max drawdown.",
		stack: ["PyTorch", "scikit-learn", "DQN"],
	},
	{
		kind: "work",
		org: "RSM",
		role: "Data Science Developer Intern",
		from: "2026-01",
		to: "2026-06",
		location: "Singapore",
		summary:
			"Designed LangGraph RAG pipelines for tax advisory with hybrid retrieval, cutting irrelevant retrievals by 30%. Served them over FastAPI, with an LLM-as-a-judge evaluation harness in MLflow and Airflow ingestion of ~200 sources.",
		stack: ["LangGraph", "Qdrant", "FastAPI", "MLflow", "Airflow"],
	},
	{
		kind: "work",
		org: "Smartkarma",
		role: "Data and Strategy Intern",
		from: "2025-05",
		to: "2025-08",
		location: "Singapore",
		summary:
			"Deployed an LLM pipeline on AWS generating quarterly bullish/bearish insights for ~5,000 equities, replacing a multi-day manual process. Also automated client data delivery and built Looker Studio dashboards.",
		stack: ["AWS", "PostgreSQL", "Looker Studio"],
	},
	{
		kind: "study",
		org: "National University of Singapore",
		role: "B.Sc. (Hons) in Data Science and Analytics",
		from: "2023-08",
		to: "2027-05",
		expected: true,
		location: "Singapore",
	},
];
