import type { FC } from "react";
import { Button } from "@/components/ui/button";

interface CampaignNavigationProps {
	onBack: () => void;
}

const CampaignNavigation: FC<CampaignNavigationProps> = ({ onBack }) => {
	return (
		<div className="mt-8 flex justify-between gap-2">
			<Button onClick={onBack} variant="ghost" type="button">
				Back
			</Button>
			<Button type="submit">Next</Button>
		</div>
	);
};

export default CampaignNavigation;
