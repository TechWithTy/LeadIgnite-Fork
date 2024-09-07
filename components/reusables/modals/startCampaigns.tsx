import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogPortal
} from '@radix-ui/react-dialog'; // Radix UI Dialog components
import { Button } from '@/components/ui/button'; // ShadCN Button
import { Input } from '@/components/ui/input'; // ShadCN Input
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select'; // ShadCN Select
import { X } from 'lucide-react'; // Close Icon
import { format } from 'date-fns';
import { DatePickerWithRange } from './dateRangePicker';
import { Textarea } from '@/components/ui/textarea';
import router from 'next/router';
const socialMediaPlatforms = ['twitter', 'instagram', 'linkedin'];
const allChannels = ['phone', 'email', 'twitter', 'instagram', 'linkedin'];

interface ChannelSelectionModalProps {
  closeModal: () => void;
  handleNext: () => void;
  primaryChannel: string;
  secondaryChannel: string;
  setPrimaryChannel: (channel: string) => void;
  setSecondaryChannel: (channel: string) => void;
}

// Step 1 Modal: Channel Selection
const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({
  closeModal,
  handleNext,
  primaryChannel,
  secondaryChannel,
  setPrimaryChannel,
  setSecondaryChannel
}) => {
  const isSocialMedia = (channel: string) =>
    socialMediaPlatforms.includes(channel);

  // Filter out the primary channel from the secondary channel options
  const filteredSecondaryChannels = allChannels.filter(
    (channel) => channel !== primaryChannel
  );

  // Update handleNext to check if both channels are social media platforms or the same channel
  const validateChannels = () => {
    if (!primaryChannel || !secondaryChannel) {
      return false; // Ensure both primary and secondary channels are selected
    }
    if (isSocialMedia(primaryChannel) && isSocialMedia(secondaryChannel)) {
      alert(
        'Primary and secondary channels cannot both be social media platforms.'
      );
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateChannels()) {
      handleNext();
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center text-lg font-semibold dark:text-white">
        Select Communication Channels
      </h2>
      <p className="mb-4 text-center text-gray-500 dark:text-gray-400">
        Choose primary and secondary channels
      </p>

      {/* Primary Channel Select */}
      <label className="mb-2 block text-sm font-semibold dark:text-gray-200">
        Primary Channel
      </label>
      <Select onValueChange={setPrimaryChannel}>
        <SelectTrigger className="mb-4 w-full rounded-md bg-gray-800 p-2 text-white">
          <SelectValue placeholder="Choose a primary channel" />
        </SelectTrigger>
        <SelectContent>
          {allChannels.map((channel) => (
            <SelectItem
              className="cursor-pointer"
              key={channel}
              value={channel}
            >
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Secondary Channel Select */}
      <label className="mb-2 block text-sm font-semibold dark:text-gray-200">
        Secondary Channel
      </label>
      <Select onValueChange={setSecondaryChannel}>
        <SelectTrigger className="mb-4 w-full rounded-md bg-gray-800 p-2 text-white">
          <SelectValue placeholder="Choose a secondary channel" />
        </SelectTrigger>
        <SelectContent>
          {filteredSecondaryChannels.map((channel) => (
            <SelectItem
              className="cursor-pointer"
              key={channel}
              value={channel}
            >
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Button to proceed to the next step */}
      <Button
        onClick={handleNextStep}
        disabled={!primaryChannel || !secondaryChannel}
        className={`mt-4 w-full ${
          !primaryChannel || !secondaryChannel
            ? 'cursor-not-allowed bg-gray-600'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Next
      </Button>
    </div>
  );
};
interface ChannelCustomizationModalProps {
  primaryChannel: string;
  secondaryChannel: string;
  handleNext: () => void;
  handleBack: () => void;
  phoneNumber?: string | null; // Optional prop for phone number
  email?: string | null; // Optional prop for email
  socialAccounts?: string[]; // List of connected social media accounts
  onConnectAccount?: (platform: string) => void; // Function to connect a new account
}
// Step 2 Modal: Channel Customization

// Mapping of actions based on the platform type
const platformActions: { [key: string]: string[] } = {
  instagram: ['Comment', 'Like', '👁️ Story', 'Follow'],
  linkedin: [
    '📩 Connections',
    'Comment',
    'Follow',
    'Like',
    '📩 Groups',
    'Invite to follow'
  ],
  twitter: ['📩 Followers', 'Follow', 'Like']
};
const ChannelCustomizationModal: React.FC<ChannelCustomizationModalProps> = ({
  primaryChannel,
  secondaryChannel,
  handleNext,
  handleBack,
  phoneNumber = null,
  email = null,
  socialAccounts = [],
  onConnectAccount
}) => {
  const [inputPhoneNumber, setInputPhoneNumber] = useState<string>(
    phoneNumber || ''
  );
  const [inputEmail, setInputEmail] = useState<string>(email || '');
  const [selectedPrimaryAccount, setSelectedPrimaryAccount] =
    useState<string>('');
  const [selectedSecondaryAccount, setSelectedSecondaryAccount] =
    useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isNextEnabled, setIsNextEnabled] = useState<boolean>(false);
  const [connectedAccounts, setConnectedAccounts] =
    useState<string[]>(socialAccounts); // Manage connected accounts

  // Phone number input restriction to exactly 11 characters (with '+1' country code)
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!value.startsWith('+1')) {
      value = '+1' + value.replace(/[^\d]/g, ''); // Remove non-digits and prepend '+1'
    } else {
      value = value.replace(/[^\d]/g, ''); // Remove non-digit characters
      value = '+1' + value.slice(1); // Ensure it keeps the '+1' prefix and allows digits after it
    }

    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    setInputPhoneNumber(value);
  };

  // Email validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputEmail(value);
  };

  // Basic email validation
  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle checkbox change for social media actions
  const handleActionChange = (action: string) => {
    setSelectedActions((prev) =>
      prev.includes(action)
        ? prev.filter((a) => a !== action)
        : [...prev, action]
    );
  };

  // Enable or disable the "Next" button based on fields
  useEffect(() => {
    const isPrimaryValid =
      primaryChannel === 'phone'
        ? inputPhoneNumber.length === 12
        : primaryChannel === 'email'
        ? isEmailValid(inputEmail)
        : selectedPrimaryAccount.length > 0 && selectedActions.length > 0;

    const isSecondaryValid =
      secondaryChannel === 'phone'
        ? inputPhoneNumber.length === 12
        : secondaryChannel === 'email'
        ? isEmailValid(inputEmail)
        : selectedSecondaryAccount.length > 0 && selectedActions.length > 0;

    setIsNextEnabled(isPrimaryValid && isSecondaryValid);
  }, [
    primaryChannel,
    secondaryChannel,
    inputPhoneNumber,
    inputEmail,
    selectedPrimaryAccount,
    selectedSecondaryAccount,
    selectedActions
  ]);

  // Detect when a new account is connected and update the state
  useEffect(() => {
    console.log(`Connected accounts count: ${connectedAccounts.length}`); // Log the count of connected accounts

    if (connectedAccounts.length > 0) {
      setIsNextEnabled(true); // Enable "Next" button if any account is connected
    }
  }, [connectedAccounts]);

  // Render customization options based on the channel type
  const renderCustomization = (
    channel: string,
    channelType: 'primary' | 'secondary'
  ) => {
    const actions = platformActions[channel.toLowerCase()] || [];

    if (channel === 'phone') {
      return (
        <>
          <label className="mb-1 block text-sm dark:text-white">
            {channelType === 'primary' ? 'Primary' : 'Secondary'} Phone Number
          </label>
          <Input
            value={inputPhoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter phone number"
            className="mb-4 w-full"
            type="text"
            maxLength={12} // Ensure maximum length of 12 characters
          />
        </>
      );
    }

    if (channel === 'email') {
      return (
        <>
          <label className="mb-1 block text-sm dark:text-white">
            {channelType === 'primary' ? 'Primary' : 'Secondary'} Email Address
          </label>
          <Input
            value={inputEmail}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="mb-4 w-full"
            type="email"
          />
          {!isEmailValid(inputEmail) && inputEmail && (
            <p className="text-red-500">Please enter a valid email address.</p>
          )}
        </>
      );
    }

    return (
      <>
        <label className="mb-1 block text-sm dark:text-white">
          {channelType === 'primary' ? 'Primary' : 'Secondary'}{' '}
          {channel.charAt(0).toUpperCase() + channel.slice(1)} Account
        </label>
        {connectedAccounts.length > 0 ? (
          <div>
            {/* Automatically display the connected account without requiring selection */}
            <Input
              value={
                channelType === 'primary'
                  ? selectedPrimaryAccount
                  : selectedSecondaryAccount
              }
              readOnly
              className="mb-4 w-full rounded-md bg-gray-800 p-2 text-white"
            />
          </div>
        ) : (
          <Button
            onClick={() => {
              const mockAccount = 'connected-account';
              const shown_account = channel.toUpperCase();
              // Check if onConnectAccount is provided
              if (onConnectAccount) {
                // Call the onConnectAccount function
                onConnectAccount(channel);

                // Simulate account connection by updating connected accounts
                setConnectedAccounts((prev) => [...prev, shown_account]);

                // Automatically set the connected account for primary or secondary
                if (channelType === 'primary') {
                  setSelectedPrimaryAccount(shown_account);
                } else {
                  setSelectedSecondaryAccount(shown_account);
                }
              } else {
                // If onConnectAccount is not provided, simulate the connection directly
                setConnectedAccounts((prev) => {
                  const updatedAccounts = [...prev, shown_account];
                  console.log('Connected accounts updated:', updatedAccounts); // Log the updated accounts
                  return updatedAccounts;
                });

                // Automatically set the connected account as primary or secondary
                if (channelType === 'primary') {
                  setSelectedPrimaryAccount(shown_account);
                } else {
                  setSelectedSecondaryAccount(shown_account);
                }
              }
            }}
            className="mb-4 w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Connect {channel.charAt(0).toUpperCase() + channel.slice(1)} Account
          </Button>
        )}

        {/* Show actions only when an account is connected */}
        {connectedAccounts.length > 0 && actions.length > 0 && (
          <div className="mt-4 flex justify-between space-x-2">
            {actions.map((action) => (
              <label key={action} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={selectedActions.includes(action)}
                  onChange={() => handleActionChange(action)}
                  className="form-checkbox"
                />
                <span className="text-white">{action}</span>
              </label>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold dark:text-white">
        Customize your Channels
      </h2>

      {/* Primary Channel Customization */}
      <div className="mb-6">
        <h3 className="text-md font-semibold dark:text-white">
          Primary Channel
        </h3>
        {renderCustomization(primaryChannel, 'primary')}
      </div>

      {/* Secondary Channel Customization */}
      <div>
        <h3 className="text-md font-semibold dark:text-white">
          Secondary Channel
        </h3>
        {renderCustomization(secondaryChannel, 'secondary')}
      </div>

      {/* Next and Back Buttons */}
      <Button
        onClick={handleNext}
        className="mt-4 w-full"
        disabled={!isNextEnabled}
      >
        Next
      </Button>
      <Button onClick={handleBack} className="mt-2 w-full">
        Back
      </Button>
    </div>
  );
};

// Define types for the props
interface FinalizeCampaignModalProps {
  campaignName: string;
  setCampaignName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  handleLaunch: () => void;
  handleBack: () => void;
  estimatedCredits: number; // Estimated credits for the campaign
}

// Step 3 Modal: Finalize Campaign

interface FinalizeCampaignModalProps {
  campaignName: string;
  setCampaignName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  handleLaunch: () => void;
  handleBack: () => void;
  estimatedCredits: number; // Estimated credits for the campaign
}
const FinalizeCampaignModal: React.FC<FinalizeCampaignModalProps> = ({
  campaignName,
  setCampaignName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleLaunch,
  handleBack,
  estimatedCredits
}) => {
  const [campaignGoal, setCampaignGoal] = useState(''); // State for campaign goal
  const [selectedVoice, setSelectedVoice] = useState('AI Voice 1'); // State for AI voice selection
  const [selectedScript, setSelectedScript] = useState('Sales Script 1'); // State for sales script selection
  const [selectedAgent, setSelectedAgent] = useState('Avatar Agent 1'); // State for avatar agent selection
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [goalError, setGoalError] = useState<string | null>(null); // Error for campaign goal

  const aiVoices = ['AI Voice 1', 'AI Voice 2', 'AI Voice 3']; // AI Voice options
  const salesScripts = ['Sales Script 1', 'Sales Script 2', 'Sales Script 3']; // Sales Script options
  const avatarAgents = ['Avatar Agent 1', 'Avatar Agent 2', 'Avatar Agent 3']; // Avatar Agent options

  // Handle input change for the campaign name
  const handleCampaignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCampaignName(name);

    // Only validate if the user has typed at least one character
    if (name.length > 0) {
      if (
        name.length < 5 ||
        name.length > 30 ||
        !/^[A-Za-z0-9. ]+$/.test(name)
      ) {
        setErrorMessage(
          'Campaign name must be between 5-30 characters and can only contain letters, numbers, spaces, and dots.'
        );
      } else {
        setErrorMessage(null);
      }
    } else {
      setErrorMessage(null); // Reset error if input is cleared
    }
  };

  // Validate campaign goal: 1 sentence minimum (10 characters with at least one period) and max 300 characters
  const handleCampaignGoalChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const goal = e.target.value;
    setCampaignGoal(goal);

    if (goal.length < 10 || !goal.includes('.')) {
      setGoalError('Campaign goal must be at least one sentence.');
    } else if (goal.length > 300) {
      setGoalError(
        'Campaign goal cannot exceed two paragraphs (~300 characters).'
      );
    } else {
      setGoalError(null); // Clear error if valid
    }
  };
  const handleCreateOption = (path: string) => {
    router.push(path); // Navigate to the "create" page
  };

  // Check if both campaign name, goal, and date range are selected to enable the button
  const isNextEnabled =
    campaignName.length >= 5 &&
    !errorMessage &&
    !goalError &&
    startDate &&
    endDate &&
    campaignGoal.length > 0;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold dark:text-white">
        Finalize your campaign
      </h2>

      {/* Campaign Name Input */}
      <label className="mb-1 block text-sm dark:text-white">
        Campaign Name
      </label>
      <Input
        value={campaignName}
        onChange={handleCampaignNameChange}
        placeholder="Enter campaign name"
        className="mb-4 w-full"
        maxLength={30}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Campaign Goal Textarea */}
      <label className="mb-1 block text-sm dark:text-white">
        Campaign Goal
      </label>
      <Textarea
        value={campaignGoal}
        onChange={handleCampaignGoalChange}
        placeholder="Enter your campaign goal (1 sentence min, 1-2 paragraphs max)"
        className="mb-4 w-full"
        rows={4}
        maxLength={300} // Limit to 300 characters
      />
      {goalError && <p className="text-red-500">{goalError}</p>}

      {/* AI Voice Selector */}
      <label className="mb-1 block text-sm dark:text-white">
        Select AI Voice
      </label>
      <Select
        onValueChange={(value) =>
          value === 'create'
            ? handleCreateOption('/create-ai-voice')
            : setSelectedVoice(value)
        }
        defaultValue={selectedVoice}
      >
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Select AI Voice" />
        </SelectTrigger>
        <SelectContent>
          {aiVoices.map((voice) => (
            <SelectItem className="cursor-pointer" key={voice} value={voice}>
              {voice}
            </SelectItem>
          ))}
          <SelectItem className="cursor-pointer" value="create">
            Create AI Voice
          </SelectItem>{' '}
          {/* Create AI Voice Option */}
        </SelectContent>
      </Select>

      {/* Sales Script Selector */}
      <label className="mb-1 block text-sm dark:text-white">
        Select Sales Script
      </label>
      <Select
        onValueChange={(value) =>
          value === 'create'
            ? handleCreateOption('/create-sales-script')
            : setSelectedScript(value)
        }
        defaultValue={selectedScript}
      >
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Select Sales Script" />
        </SelectTrigger>
        <SelectContent>
          {salesScripts.map((script) => (
            <SelectItem className="cursor-pointer" key={script} value={script}>
              {script}
            </SelectItem>
          ))}
          <SelectItem className="cursor-pointer" value="create">
            Create Sales Script
          </SelectItem>{' '}
          {/* Create Sales Script Option */}
        </SelectContent>
      </Select>

      {/* Avatar Agent Selector */}
      <label className="mb-1 block text-sm dark:text-white">
        Select Avatar Agent
      </label>
      <Select
        onValueChange={(value) =>
          value === 'create'
            ? handleCreateOption('/create-avatar-agent')
            : setSelectedAgent(value)
        }
        defaultValue={selectedAgent}
      >
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Select Avatar Agent" />
        </SelectTrigger>
        <SelectContent>
          {avatarAgents.map((agent) => (
            <SelectItem className="cursor-pointer" key={agent} value={agent}>
              {agent}
            </SelectItem>
          ))}
          <SelectItem className="cursor-pointer" value="create">
            Create Avatar Agent
          </SelectItem>{' '}
          {/* Create Avatar Agent Option */}
        </SelectContent>
      </Select>

      {/* Date Range Picker */}
      <label className="mb-1 block text-sm dark:text-white">
        Select Date Range
      </label>
      <DatePickerWithRange
        from={startDate ? new Date(startDate) : undefined}
        to={endDate ? new Date(endDate) : undefined}
        setDateRange={(range) => {
          if (range?.from) {
            setStartDate(format(range.from, 'yyyy-MM-dd'));
          }
          if (range?.to) {
            setEndDate(format(range.to, 'yyyy-MM-dd'));
          } else {
            setEndDate('');
          }
        }}
      />

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        This campaign will cost {estimatedCredits} credits.
      </p>

      {/* Only show Launch button if campaign name, goal, and date range are valid */}
      <Button
        onClick={handleLaunch}
        className="w-full"
        type="button"
        disabled={!isNextEnabled}
      >
        Launch Campaign
      </Button>

      <Button onClick={handleBack} className="mt-2 w-full" type="button">
        Back
      </Button>
    </div>
  );
};

// Main Component
const MultiStepCampaign: React.FC<{ closeModal: () => void }> = ({
  closeModal
}) => {
  const [step, setStep] = useState(1);
  const [primaryChannel, setPrimaryChannel] = useState<string>('');
  const [secondaryChannel, setSecondaryChannel] = useState<string>('');
  const [campaignName, setCampaignName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const estimatedCredits = 500;
  const isSocialMedia = (channel: string) =>
    socialMediaPlatforms.includes(channel);

  const handleNext = () => {
    if (isSocialMedia(primaryChannel) && isSocialMedia(secondaryChannel)) {
      alert(
        'Primary and secondary channels cannot both be social media platforms.'
      );
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);
  const handleLaunch = () => {
    alert(`Campaign "${campaignName}" launched!`);
    closeModal();
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-40 bg-black bg-opacity-50" />
        <DialogContent className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md rounded-md bg-white p-6 shadow-lg dark:bg-gray-900">
            <button onClick={closeModal} className="absolute right-4 top-4">
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>

            {step === 1 && (
              <ChannelSelectionModal
                closeModal={closeModal}
                handleNext={handleNext}
                primaryChannel={primaryChannel}
                secondaryChannel={secondaryChannel}
                setPrimaryChannel={setPrimaryChannel}
                setSecondaryChannel={setSecondaryChannel}
              />
            )}

            {step === 2 && (
              <ChannelCustomizationModal
                primaryChannel={primaryChannel || ''} // Default to empty string if null
                secondaryChannel={secondaryChannel || ''} // Default to empty string if null
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}

            {step === 3 && (
              <FinalizeCampaignModal
                campaignName={campaignName}
                setCampaignName={setCampaignName}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate} // Add this missing prop
                setEndDate={setEndDate} // Add this missing prop
                handleLaunch={handleLaunch}
                handleBack={handleBack}
                estimatedCredits={estimatedCredits} // Add this missing prop
              />
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default MultiStepCampaign;
