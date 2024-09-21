'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  profileSchema,
  type ProfileFormValues
} from '@/types/zod/userSetup/profile-form-schema';
import { cn } from '@/lib/utils/kanban/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle, Trash, Trash2Icon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import VoiceSelector from './utils/voice/selector';
import { mockVoices } from '@/constants/_faker/_api/vapi/assistant';
import { UploadEmailBody } from './utils/voice/uploadEmailBody';
import UploadSalesScript from './utils/voice/uploadScript';
import { campaignSteps } from '@/_tests/tours/campaignTour';
import PropertySearchModal from '@/components/reusables/tutorials/walkthroughModal';
import { Switch } from '@/components/ui/switch';

const twoFactorAuthOptions = [
  { name: 'twoFactoAuth.sms', label: 'SMS' },
  { name: 'twoFactoAuth.email', label: 'Email ' },
  { name: 'twoFactoAuth.authenticatorApp', label: 'Authenticator App' }
];

const notificationOptions = [
  { name: 'notifications.emailNotifications', label: 'Email ' },
  { name: 'notifications.smsNotifications', label: 'SMS' },
  { name: 'notifications.notifyForNewLeads', label: 'New Leads' },
  { name: 'notifications.notifyForCampaignUpdates', label: 'Campaign Updates' }
];
interface ProfileFormType {
  initialData: any | null;
  categories: any;
}

// 1. Profile Heading Component
const ProfileHeading: React.FC<{
  title: string;
  description: string;
  loading: boolean;
  onDelete: () => void;
  showDeleteButton: boolean;
}> = ({ title, description, loading, onDelete, showDeleteButton }) => (
  <div className="flex flex-col items-center justify-between text-center sm:flex-row sm:text-left">
    <Heading title={title} description={description} />
    {showDeleteButton && (
      <Button
        disabled={loading}
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="mt-2 sm:mt-0"
      >
        <Trash className="h-4 w-4" />
      </Button>
    )}
  </div>
);

// 2. Personal Information Form Component
// 2. Personal Information Form Component
const PersonalInformationForm: React.FC<{
  form: any;
  loading: boolean;
  countries: { id: string; name: string }[];
  cities: { id: string; name: string }[];
}> = ({ form, loading, countries, cities }) => (
  <>
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input disabled={loading} placeholder="John" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input disabled={loading} placeholder="Doe" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="companyName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Company name</FormLabel>
          <FormControl>
            <Input disabled={loading} placeholder="Apex Company" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="companyLogo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Company Logo</FormLabel>
          <FormControl>
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  field.onChange(file); // Handle the file input here
                }
              }}
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              disabled={loading}
              placeholder="johndoe@gmail.com"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="personalNum"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Personal Phone Number</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter your phone number"
              disabled={loading}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="city"
      render={({ field }) => (
        <FormItem>
          <FormLabel>City</FormLabel>
          <Select
            disabled={loading}
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  defaultValue={field.value}
                  placeholder="Select a city"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Select
            disabled={loading}
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  defaultValue={field.value}
                  placeholder="Select a country"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Two-Factor Authentication (2FA) Section */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Two-Factor Authentication (2FA)</h3>
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {twoFactorAuthOptions.map((option) => (
          <FormField
            key={option.name}
            control={form.control}
            name={option.name}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="mr-4">{option.label}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>

    {/* Notifications Section */}
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Notifications</h3>
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notificationOptions.map((option) => (
          <FormField
            key={option.name}
            control={form.control}
            name={option.name}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="mr-4">{option.label}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  </>
);

// 3. Job Accordion Component
const BaseSetup: React.FC<{
  fields: any[];
  remove: (index: number) => void;
  form: any;
  index: number;
  loading: boolean;

  voices: AssistantVoice[]; // Add voices prop for VoiceSelector
  handleVoiceSelect: (voiceId: string) => void; // Voice select handler
  handleScriptUpload: (scriptContent: string) => void; // Script upload handler
  selectedScriptFileName: string; // Selected script file name
  handleEmailUpload: (emailContent: string) => void; // Email upload handler
  selectedEmailFileName: string; // Selected email file name
}> = ({
  fields,
  remove,
  form,
  index,
  loading,
  voices,
  handleVoiceSelect,
  handleScriptUpload,
  selectedScriptFileName,
  handleEmailUpload,
  selectedEmailFileName
}) => (
  <>
    {/* Add margin to ensure spacing between sections */}
    <div className="mt-4">
      {/* Adding Voice Selector */}
      <FormLabel>(Optional) Select Voice</FormLabel>

      <VoiceSelector voices={voices} onVoiceSelect={handleVoiceSelect} />
    </div>

    <div className="mt-4">
      {/* File Upload Section for Sales Script */}
      <FormLabel>(Optional) Sales Script</FormLabel>

      <UploadSalesScript
        onFileUpload={handleScriptUpload}
        selectedFileName={selectedScriptFileName}
      />
    </div>

    <div className="mt-4">
      {/* Email Body Upload Component */}
      <FormLabel>(Optional) Email Body</FormLabel>

      <UploadEmailBody
        onFileUpload={handleEmailUpload}
        selectedFileName={selectedEmailFileName}
      />
    </div>
  </>
);

// 4. Step Navigation Component
// 4. Step Navigation Component
const StepNavigation: React.FC<{
  currentStep: number;
  stepsLength: number;
  next: () => void;
  prev: () => void;
  nextDisabled?: boolean; // Added nextDisabled prop (optional)
}> = ({ currentStep, stepsLength, next, prev, nextDisabled = false }) => (
  <div className="mt-8 flex justify-between pt-5">
    {/* Previous Button */}
    <button
      type="button"
      onClick={prev}
      disabled={currentStep === 0}
      className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Previous
    </button>

    {/* Next Button */}
    <button
      type="button"
      onClick={next}
      disabled={currentStep === stepsLength - 1 || nextDisabled}
      className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

// Main Component

// Main Component

// Main Component
// Main Component
export const CreateProfileUpdated: React.FC<ProfileFormType> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false); // State for help modal visibility
  const [isTourOpen, setIsTourOpen] = useState(false); // State for the tour

  const handleHelpOpenModal = () => setIsHelpModalOpen(true);
  const handleHelpCloseModal = () => setIsHelpModalOpen(false);
  const handleHelpStartTour = () => setIsTourOpen(true);
  const handleHelpCloseTour = () => setIsTourOpen(false);
  const [selectedScriptFileName, setSelectedScriptFileName] =
    useState<string>(''); // Track uploaded file name
  const [selectedEmailFileName, setSelectedEmailFileName] =
    useState<string>(''); // Track uploaded file name

  const [selectedVoice, setSelectedVoice] = useState<string | null>(null); // Track selected voice
  const title = initialData ? 'Create Profile' : 'Edit Your Profile';
  const description = initialData
    ? 'Create your profile to optimize, your lead generation'
    : 'Edit your profile, change callback number script etc.';
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});

  // const defaultValues = {
  //   jobs: [
  //     {
  //       jobtitle: '',
  //       employer: '',
  //       startdate: '',
  //       enddate: '',
  //       jobcountry: '',
  //       jobcity: ''
  //     }
  //   ]
  // };

  // useForm setup with Zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const {
    control,
    setValue, // Used to set values programmatically for form fields
    formState: { isValid, isSubmitting }
  } = form;
  const { append, remove, fields } = useFieldArray({ control, name: 'jobs' });

  const steps = [
    {
      id: 'Personal Information',
      name: 'Setup Profile',
      fields: [
        'firstName',
        'lastName',
        'email',
        'personalNum',
        'country',
        'city',
        'twoFactoAuth',
        'notifications'
      ]
    },
    {
      id: 'Upload Company Assets',
      name: 'Setup Your Base',
      fields: [
        'companyName',
        'companyLogo',
        'explainerVideoUrl',
        'assets',
        'outreachEmail',
        'forwardingNumber'
      ]
    },
    {
      id: 'Optimize Your Outreach',
      name: 'Setup Ai Knowledgebase',
      fields: [
        'selectedVoice',
        'clonedVoiceId',
        'exampleSalesScript',
        'exampleEmailBody',
        'outreachEmailAddress',
        'leadForwardingNumber',
        'voicemailRecordingId'
      ]
    }
  ];

  const next = async () => {
    const stepFields = steps[currentStep].fields as (keyof ProfileFormValues)[];

    const isStepValid = await form.trigger(stepFields);

    if (isStepValid) {
      if (currentStep < steps.length - 1) {
        if (currentStep === steps.length - 2) {
          await form.handleSubmit((data) => setData(data))();
        }
        setCurrentStep((step) => step + 1);
      }
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((step) => step - 1);
  };

  const countries = [{ id: '1', name: 'India' }];
  const cities = [{ id: '2', name: 'Kerala' }];

  const voices: AssistantVoice[] = mockVoices; // Generate 5 mock voices

  // Handle voice selection (use useState for tracking selected voice)
  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId); // Set voice state when selected
    console.log('Selected voice:', voiceId);
  };

  // Function to handle file uploads
  const handleScriptUpload = (fileContent: string) => {
    setValue('leadForwardingNumber', fileContent); // Store the email body content
    console.log('Uploaded Email Body Content:', fileContent);
  };
  const handleEmailUpload = (fileContent: string) => {
    setValue('outreachEmailAddress', fileContent); // Store the email body content
    console.log('Uploaded Email Body Content:', fileContent);
  };
  return (
    <>
      <ProfileHeading
        title={title}
        description={description}
        loading={loading}
        onDelete={() => setOpen(true)}
        showDeleteButton={!!initialData}
      />
      <div className="flex items-center justify-center">
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="animate-bounce rounded-full bg-blue-500 p-2 text-white hover:animate-none dark:bg-green-700 dark:text-gray-300"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      <Separator />
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={cn(
                  'group flex w-full flex-col py-2 pl-4',
                  currentStep > index
                    ? 'border-l-4 border-sky-600'
                    : 'border-l-4 border-gray-200'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    currentStep > index ? 'text-sky-600' : 'text-gray-500'
                  )}
                >
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Separator />

      <PropertySearchModal
        isOpen={isHelpModalOpen}
        onClose={handleHelpCloseModal}
        videoUrl="https://www.youtube.com/embed/example-video" // Example YouTube video URL
        title="Welcome to Your Profile Setup"
        subtitle="Learn how to create or edit your profile, optimize your settings, and improve lead generation."
        steps={campaignSteps} // Steps for the tour
        isTourOpen={isTourOpen}
        onStartTour={handleHelpStartTour}
        onCloseTour={handleHelpCloseTour}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => {})}
          className="w-full space-y-8"
        >
          <div
            className={cn(
              currentStep === 1
                ? 'w-full md:inline-block'
                : 'gap-8 md:grid md:grid-cols-3'
            )}
          >
            {currentStep === 0 && (
              <PersonalInformationForm
                form={form}
                loading={loading}
                countries={countries}
                cities={cities}
              />
            )}

            {currentStep === 1 &&
              fields.map((field, index) => (
                <BaseSetup
                  key={index}
                  fields={fields}
                  remove={remove}
                  form={form}
                  index={index}
                  loading={loading}
                  voices={voices} // Pass the voices prop for VoiceSelector
                  handleVoiceSelect={handleVoiceSelect} // Pass the handler for voice selection
                  handleScriptUpload={handleScriptUpload} // Pass the handler for script upload
                  selectedScriptFileName={selectedScriptFileName} // Pass the selected script file name
                  handleEmailUpload={handleEmailUpload} // Pass the handler for email upload
                  selectedEmailFileName={selectedEmailFileName} // Pass the selected email file name
                />
              ))}
            {currentStep === 2 && (
              <div>
                <h1>Completed</h1>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(data)}
                </pre>
              </div>
            )}
          </div>
        </form>
      </Form>
      <StepNavigation
        currentStep={currentStep}
        stepsLength={steps.length}
        next={next}
        prev={prev}
      />
    </>
  );
};
