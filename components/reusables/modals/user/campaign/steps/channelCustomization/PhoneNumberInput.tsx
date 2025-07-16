import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui/input";

const PhoneNumberInput = forwardRef<HTMLInputElement, InputProps>(
	(props, ref) => {
		return (
			<div>
				<label htmlFor="callPhone" className="mb-1 block text-sm">
					Primary Phone Number
				</label>
				<Input
					id="callPhone"
					placeholder="+1 XXX-XXX-XXXX"
					className="w-full"
					type="text"
					maxLength={12}
					{...props}
					ref={ref}
				/>
				<p className="mt-1 text-xs text-gray-500">
					Update your phone number on your profile.
				</p>
			</div>
		);
	},
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
