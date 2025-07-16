import type { FC } from "react";
import UpdatedDropdown from "@/components/ui/updatedDropdown";
import type { LeadList } from "@/types/_dashboard/leadList";

interface LeadListSelectorProps {
	value?: string;
	onChange: (value: string) => void;
	leadLists: LeadList[];
}

const LeadListSelector: FC<LeadListSelectorProps> = ({
	value,
	onChange,
	leadLists,
}) => {
	const options = leadLists.map((list) => ({
		id: list.id, // * No need to convert to string, it's already a string
		name: list.listName,
	}));

	return (
		<UpdatedDropdown
			label="Select Lead List"
			placeholder="-- Select a lead list --"
			value={value || ""}
			onChange={onChange}
			options={options}
		/>
	);
};

export default LeadListSelector;
